// Active button Color change:

const filterButtons = document.querySelectorAll(".button");

filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    filterButtons.forEach((btn) => {
      btn.classList.remove("btn-primary");
    });

    this.classList.add("btn-primary");
  });
});

// Count Issues:

function countIssues(issues) {
  const total = issues.length;

  const open = issues.filter((issue) => issue.status === "open").length;

  const closed = issues.filter((issue) => issue.status === "closed").length;

  document.getElementById("tabCount").innerText = total;
  document.getElementById("openCount").innerText = open;
  document.getElementById("closedCount").innerText = closed;
}

// Load All Issues:

const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

const container = document.getElementById("issuesContainer");
const spinner = document.getElementById("spinner");

// Load Issues

async function loadIssues(type) {
  spinner.classList.remove("hidden");

  const res = await fetch(API);
  const data = await res.json();

  let issues = data.data;

  if (type === "open") {
    issues = issues.filter((issue) => issue.status === "open");
  }

  if (type === "closed") {
    issues = issues.filter((issue) => issue.status === "closed");
  }

  countIssues(issues);
  displayIssues(issues);

  spinner.classList.add("hidden");
}

loadIssues("all");

const createElements = (arr) => {
  const htmlElements = arr.map(
    (el) =>
      `<span class="badge badge-outline font-medium text-[10px] bg-[#D97706]">${el}</span>`,
  );
  return htmlElements.join(" ");
};

// Display Cards

function displayIssues(issues) {
  container.innerHTML = "";

  issues.forEach((issue) => {
    const borderColor =
      issue.status === "open" ? "border-green-500" : "border-purple-500";

    const card = document.createElement("div");

    card.className = `card bg-white shadow border-t-4 ${borderColor}`;

    card.innerHTML = `

<div class="card-body">

<div class="flex justify-between items-center">
                <span
                    class="badge badge-outline text-[green] font-medium text-[10px]">${issue.status}</span>
                <span
                    class="badge badge-outline text-[#EF4444] font-medium text-[10px]">${issue.priority}</span>
            </div>

            <h2 class="card-title cursor-pointer font-semibold text-[14px]"
                onclick="showDetails(${issue.id})">${issue.title}</h2>
            <p id="description" class="text-[#64748B] text-[12px]">${issue.description}</p>

            <div class="">
                <div class="flex items-center gap-1">${createElements(issue.labels)}</div>

            </div>
            <div class="divider"></div>

            <p><span class="text-[12px]">#1
                    by &nbsp</span>${issue.author}</p>
            <p class="text-[12px]">${issue.createdAt}</p>
        </div>
`;

    container.appendChild(card);
  });
}

// Modal Details

async function showDetails(id) {
  spinner.classList.remove("hidden");
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );

  const data = await res.json();

  const issue = data.data;
  console.log(issue);

  const detailsModal = document.getElementById("details-modal");
  detailsModal.innerHTML = `
<h2 id="modalTitle" class="font-bold text-[24px]">${issue.title}</h2>

            <div class="flex items-center gap-2">
                <span id="modalStatus"
                    class="badge badge-outline text-white text-[green] font-medium text-[10px]">${issue.status}</span>

                <p class="text-[#64748B] text-[12px]">.&nbsp Opened by &nbsp<span id="modalAuthor">${issue.author}</span>
                </p>
                <p class="text-[#64748B] text-[12px]">.&nbsp<span id="modalCreatedAt">${issue.createdAt}</span></p>
            </div>

            <div id="modalLabels" class="flex items-center gap-2 py-3 badge font-medium text-[10px]">

                <div class="flex items-center gap-1">${createElements(issue.labels)}</div>
            </div>

            <p id="modalDescription" class="text-[#64748B]">${issue.description}</p>
            <div class="flex items-center gap-[150px] bg-gray-100 p-2 rounded-xl">
                <p>Assignee:<br><span id="modalAssignee" class="font-semibold">${issue.assignee ? issue.assignee : "Unassigned"}</span></p>

                <p>Priority:<br><span class="badge badge-outline text-[#EF4444] font-medium text-[10px]"
                        id="modalPriority">${issue.priority}</span></p>
            </div>

`;

  document.getElementById("issueModal").showModal();
  spinner.classList.add("hidden");
}

// Search

async function searchIssue() {
  const text = document.getElementById("searchInput").value;
  spinner.classList.remove("hidden");
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`,
  );

  const data = await res.json();

  displayIssues(data.data);
  spinner.classList.add("hidden");
}

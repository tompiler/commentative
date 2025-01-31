let articleParagraphs = document.querySelectorAll(".article > div > div > *");
let submitCommentForm = document.querySelector(".submitComments");
let firstSubmit = true;
let url =
  "https://8rj0xswzt3.execute-api.eu-west-1.amazonaws.com/dev/commentative";

window.addEventListener("scroll", event => {
  let fromTop = window.scrollY;
  articleParagraphs.forEach(para => {
    let paragraphHeight = para.offsetHeight;
    let middleOfWindow = window.innerHeight / 2;
    let viewportTopOffset = para.getBoundingClientRect().top;
    let topBoundary = middleOfWindow - paragraphHeight;
    let bottomBoundary = middleOfWindow;
    if (
      viewportTopOffset <= bottomBoundary &&
      viewportTopOffset >= topBoundary
    ) {
      para.classList.add("selected");
    } else {
      para.classList.remove("selected");
    }
  });
});

function addIndexToParagraphs() {
  articleParagraphs.forEach((element, index) => {
    element.setAttribute("data-article-element-index", index + 1);
  });
}

function addComment() {
  document.querySelector(".addComment").addEventListener("click", function(e) {
    e.preventDefault();
    const reference = document
      .querySelector(".selected")
      .getAttribute("data-article-element-index");
    const body = document.querySelector(".addCommentText").value;
    const user = "Jamie";
    if (firstSubmit) {
      const articleBody = document.querySelector(".articleBody").value;
      firstSubmit = false;
      const params = { user, articleBody, commentData: [{ body, reference }] };
      fetch(url, {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          return res.text();
        })
        .then(res => {
          const result = JSON.parse(res);
          history.pushState(null, "", "/" + result.uuid);
          addNewComment();
          document.querySelector(".addCommentText").value = "";
        });
    } else {
      const path = window.location.pathname.split("/");
      const uuid = path[path.length - 1];
      const params = { user, commentData: [{ body, reference }] };
      console.log("hello", url + "/" + uuid);
      fetch(url + "/" + uuid, {
        method: "PUT",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          console.log(res);
          return res.text();
        })
        .then(res => {
          console.log(res);
          addNewComment();
          document.querySelector(".addCommentText").value = "";
        });
    }
  });
}

function addNewComment(content = "This is a comment", name = "Jamie") {
  const newCommentBox = document.querySelector(".new-comment");

  const commentBlock = document.createElement("div");
  commentBlock.classList.add("comment-block");
  const commentName = document.createElement("div");
  commentName.classList.add("comment-name");
  const commentContent = document.createElement("div");
  commentContent.classList.add("comment-content");
  commentContent.innerHTML = content;
  commentName.innerHTML = name;

  commentBlock.appendChild(commentName);
  commentBlock.appendChild(commentContent);

  newCommentBox.appendChild(commentBlock);
}

addIndexToParagraphs();
addComment();

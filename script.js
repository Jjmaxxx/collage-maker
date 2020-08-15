var numOfImgs = 0;
let resizers;
let allowMove = true;
let startDragX,startDragY;
function loadFile(event){
  let modal = document.getElementById("modalInput");
  let popup = document.createElement("iframe");
  let newImage = document.createElement("img");
  let event1 = this.event;
  let container= document.getElementById("container");
  let imageDiv = document.createElement("div");
  modal.style.display = "block";
  modal.children[0].removeChild(modal.children[0].firstChild);
  appendIframe(popup, modal);
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      let widthOfImage = popup.contentWindow.document.getElementById('width1');
      let heightOfImage = popup.contentWindow.document.getElementById('height1');
      container.appendChild(imageDiv);
      imageDiv.id = numOfImgs;
      imageDiv.draggable = true;
      newImage.style.width ="100%";
      newImage.style.height = "100%"; 
      newImage.style.position = "absolute";
      newImage.overflow = "hidden";
      newImage.style.zIndex = -1;
      newImage.className = "img";
      imageDiv.ondragstart = function(event){
        event.dataTransfer.setData("text", event.target.id);
        startDragX = event.pageX;
        startDragY = event.pageY;
      } 
      newImage.src = URL.createObjectURL(event1.target.files[0]);
      imageDiv.appendChild(newImage);
      createResizers(widthOfImage,heightOfImage,imageDiv);
      numOfImgs++;
      resize(imageDiv);
    }
  }
}
let imgEvent;
window.addEventListener("click", function(event) {
  for(let i=0;i<container.children.length; i++){
    if(container.children[i].id == event.target.id){
      imgEvent = event;
      container.children[i].draggable = false;
      container.children[i].children[1].style.display = "block";
      container.children[i].children[2].style.display = "block";
      container.children[i].children[3].style.display = "block";
      container.children[i].children[4].style.display = "block";
      deleteImage(i);
    }else{
      container.children[i].draggable = true;
      allowMove = true;
      container.children[i].children[1].style.display = "none";
      container.children[i].children[2].style.display = "none";
      container.children[i].children[3].style.display = "none";
      container.children[i].children[4].style.display = "none";
    }
  }
});
function deleteImage(i){
  window.addEventListener("keydown", keyDown);
  function keyDown(event){
    //something is messing up the selector so i need another if statement and cant just not have the if statement which is kinda dumb but whatever
    if(event.keyCode == 8){
      if(container.children[i].id == imgEvent.target.id){
          event.preventDefault();
          container.children[i].style.display = 'none';
        }  
      }
    window.removeEventListener('keydown', keyDown);  
  }
}
function appendIframe(popup, modal){
  popup.setAttribute('src', 'popup.html');
  popup.id = "popup";
  popup.frameBorder = 0;
  modal.children[0].appendChild(popup);
}
let rect;
function onDragOver(event){
  var data = event.dataTransfer.getData("text");
  //need this bc by default browser will try to open link with img
  event.preventDefault();
  rect = document.getElementById(data).getBoundingClientRect();
}
function drop(event){
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  document.getElementById(data).style.left = rect.left - (startDragX - event.pageX)  + 'px';
  document.getElementById(data).style.top = rect.top - (startDragY - event.pageY) + 'px';
} 
let borderOn = false;
var image = document.getElementsByClassName('img');
function enableBorder(){
  if(borderOn == false){
    for(i = 0; i < image.length; i++) {
      image[i].parentNode.style.border = '2px black solid';
    }
    borderOn = true;
  }else{
    for(i = 0; i < image.length; i++) {
      image[i].parentNode.style.border = "none"; 
    }
    borderOn = false;
  }
}


function createResizers(imgWidth,imgHeight,imageDiv){
  let nw = document.createElement("div");
  let ne = document.createElement("div");
  let sw = document.createElement("div");
  let se = document.createElement("div");
  imageDiv.className = "imageDiv";
  imageDiv.style.width = imgWidth.value + 'px';
  imageDiv.style.height = imgHeight.value + 'px';
  nw.className = "resizer nw";
  ne.className = "resizer ne";
  sw.className = "resizer sw";
  se.className = "resizer se";
  nw.style.display = "none";
  ne.style.display = "none";
  sw.style.display = "none";
  se.style.display = "none";
  imageDiv.appendChild(nw);
  imageDiv.appendChild(ne);
  imageDiv.appendChild(sw);
  imageDiv.appendChild(se);
}
let currentResizer;
function resize(imageDiv){
  resizers = container.children[numOfImgs-1].querySelectorAll(".resizer");
    resizers.forEach((resizer)=>{
      resizer.removeEventListener('mousedown', mousedown);
      resizer.addEventListener('mousedown', mousedown);
      function mousedown(event){
        currentResizer = event.target;
        let previousX = event.clientX;
        let previousY = event.clientY;
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup',mouseup);
        function mousemove(event){
          // getBoundingClientRect returns the size of an element and its position 
          let rect = imageDiv.getBoundingClientRect();
          if(currentResizer.classList.contains('se')){
            imageDiv.style.width = rect.width - (previousX - event.clientX) + 'px';
            imageDiv.style.height = rect.height - (previousY - event.clientY) + 'px';
          }else if(currentResizer.classList.contains('sw')){
            imageDiv.style.width = rect.width + (previousX - event.clientX) + 'px';
            imageDiv.style.height = rect.height - (previousY - event.clientY) + 'px';
            imageDiv.style.left = rect.left - (previousX - event.clientX) + "px";
          }else if(currentResizer.classList.contains('ne')){
            imageDiv.style.width = rect.width - (previousX - event.clientX) + 'px';
            imageDiv.style.height = rect.height + (previousY - event.clientY) + 'px';
            imageDiv.style.top = rect.top - (previousY - event.clientY) + "px";
          }else{
            imageDiv.style.width = rect.width + (previousX - event.clientX) + 'px';
            imageDiv.style.height = rect.height + (previousY - event.clientY) + 'px';
            imageDiv.style.top = rect.top - (previousY - event.clientY) + "px";
            imageDiv.style.left = rect.left - (previousX - event.clientX) + "px";
          }
          previousX = event.clientX;
          previousY = event.clientY;
        }
      function mouseup(){
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
      }
    }
  })
}
//console.log(typeof 32); output = number
let downloadButton = document.getElementById('download');
downloadButton.addEventListener("click", function() {
  container.style.border = "none";
  //allowTaint allows image to show in canvas
  html2canvas(container,{allowTaint: true, backgroundColor: null}).then(function(canvas) {
    saveAs(canvas.toDataURL(), 'myCollage.png');
  })
})
function saveAs(url, filename){
  var downloadLink = document.createElement('jiasjdoaijd');
  downloadLink.href = url;
  downloadLink.download = filename;
  downloadLink.click();
  window.open(url);
  container.style.border = "2px solid black";
  canvas.remove();
}
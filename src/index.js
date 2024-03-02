import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";


const urlSearch="https://pixabay.com/api/?";
const keyApiPixabay="42634392-264e3602e9e7cdc4b4795b45b";
const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const nextPageBtn = document.querySelector("#nextPage");
const pInfo = document.querySelector('#pInfo');
let lightbox;

const queryPar = new URLSearchParams({
  key: keyApiPixabay,
  q: "",
  image_type: 'photo',
  orientation: 'horizontal',
  page:1,
  per_page: 40,
});

const showValue=((data)=>{ 
  if(data.hits.length<=0){
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
      gallery.innerHTML="";
    nextPageBtn.classList.add("hidden");
    form.elements.searchQuery.value="";
    pInfo.classList.add("hidden");
  }
  else{
  // console.log("test");
    console.log(data);
    gallery.replaceChildren();
    console.log(data.hits.length);
    if(queryPar.get("page")==1){
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }


    if(data.hits.length>=40)
    {
      nextPageBtn.classList.remove('hidden');
      pInfo.classList.add('hidden');
    }else{
      pInfo.classList.remove('hidden');
      nextPageBtn.classList.add('hidden');
    }

    data.hits.map(({webformatURL,largeImageURL,tags, likes, views, comments, downloads})=>{

      gallery.insertAdjacentHTML('beforeend',
        `
        <figure class="photo-card">
        <a href="${largeImageURL}" class="gallery__image">
          <div class="thumb">
            <img class="galleryImg" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <figcaption class="label">
            
              <div class="info">
                <p class="info-item">
                  <b>Likes</b>
                  ${likes}
                </p>
                <p class="info-item">
                  <b>Views</b>
                  ${views}
                </p>
                <p class="info-item">
                  <b>Comments</b>
                  ${comments}
                </p>
                <p class="info-item">
                  <b>Downloads</b>
                  ${downloads}
                </p>
              </div>
            </figcaption>
            
          </div>
          </a>
          </figure>
        `
      );
    });
    lightbox = new SimpleLightbox('.gallery a',{
        captionsData: 'alt',
        captionDelay: 250,
      });
  }
});

const fetchSearch = async () =>{
  pInfo.classList.add('hidden');
  queryPar.set("q",form.elements.searchQuery.value.split(" ").join("+"));
  const res = await axios.get(`${urlSearch}${queryPar}`);
  return res;
};

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if(form.elements.searchQuery.value.trim()==""){
    Notify.warning('Enter some text...');
    gallery.innerHTML="";
    nextPageBtn.classList.add("hidden");
    form.elements.searchQuery.value="";
    pInfo.classList.add("hidden");
  }else{
  queryPar.set("page", 1);
  fetchSearch()
    .then(res => showValue(res.data))
    .catch(error => console.log(error));
  }
});

nextPageBtn.addEventListener("click",(evt) =>{
  evt.preventDefault();
  if(form.elements.searchQuery.value.trim()==""){
    Notify.warning('Enter some text...');
    gallery.innerHTML="";
    nextPageBtn.classList.add("hidden");
    form.elements.searchQuery.value="";
    pInfo.classList.add("hidden");
  }else{
    const nextPage=Number(queryPar.get("page"))+1;
    console.log(nextPage);
    queryPar.set("page", nextPage);
    fetchSearch()
      .then(res => showValue(res.data))
      .catch(error => console.log(error));
  }
  
});
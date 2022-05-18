import api from './Api.js';
import mealCount from './mealCount.js';
import Modal from './Modal.js';
import { INVOLVEMENT_API_KEY } from './environment.js';

class MainUi {
  setup = async () => {
    await this.showList();
    this.idApp = INVOLVEMENT_API_KEY || await api.createApp();
    await this.showLikes();
  };

  openComments = async (event) => {
    const idMeal = event.target.parentElement.dataset.mealId;
    const data = await api.getMeal(idMeal);
    const comments = await api.getComments(this.idApp, idMeal);
    const modal = new Modal(data, comments);
    modal.open();
  };

  addLike = async (event) => {
    const likeBtn = event.target;
    const liElement = likeBtn.parentElement.parentElement;
    const { mealId } = liElement.dataset;
    await api.addLike(this.idApp, mealId);
    const likes = await api.getLikes(this.idApp);
    await this.showLike(liElement, likes);
  };

  showMealCount = () => mealCount();

  showItem = async (listElement, item) => {
    const liElement = `<li class="card" data-meal-id="${item.idMeal}">
      <img src="${item.strMealThumb}/preview" alt="${item.strMeal}  image">
      <div class="dish-name">
        <span>${item.strMeal}</span>
        <i class="fa-regular fa-heart"></i>
      </div>
      <div class="likes">n likes</div>
      <button type="button" class="main-button meal-comment"">Coments</button>
      <button type="button" class="main-button">Reservations</button>
    </li>`;
    listElement.insertAdjacentHTML('beforeend', liElement);
    const btnElement = listElement.lastChild.querySelector('button');
    btnElement.addEventListener('click', this.openComments);
    const likeElement = listElement.lastChild.querySelector('i');
    likeElement.addEventListener('click', this.addLike);
  };

  showList = async () => {
    const dishes = await api.getByCategory('Chicken');
    const listElement = document.querySelector('#item-list');
    dishes.forEach((dish) => {
      this.showItem(listElement, dish);
    });
    this.showMealCount();
  };

  showLike = async (element, likes) => {
    let likeElement = element;
    if (element.nodeName === 'LI') {
      likeElement = element.querySelector('.likes');
    }
    const { mealId } = likeElement.parentElement.dataset;
    const like = likes.find((item) => item.item_id === mealId) || {};
    const count = like.likes || 0;
    likeElement.textContent = `${count} Likes`;
  };

  showLikes = async () => {
    const likes = await api.getLikes(this.idApp);
    const listElement = document.querySelector('#item-list');
    const likesList = listElement.querySelectorAll('.likes');
    likesList.forEach((likeElement) => {
      this.showLike(likeElement, likes);
    });
  };
}

const mainUi = new MainUi();

export default mainUi;

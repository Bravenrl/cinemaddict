import { ProfileRank } from '../const';

const getRating = (movies) => {
  const rating = movies.filter((movie) => movie.userDetails.alreadyWatched).length;
  if ((rating>=ProfileRank.novice.from)&&(rating<=ProfileRank.novice.to)) {return 'novice';}
  if ((rating>=ProfileRank.fan.from)&&(rating<=ProfileRank.fan.to)) {return 'fan';}
  if ((rating>=ProfileRank.movieBuff.from)&&(rating<ProfileRank.movieBuff.to)) {return 'movie buff';}
  return '';
};

export const createProfileTemplate = (movies) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getRating(movies)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

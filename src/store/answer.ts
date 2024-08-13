import { makeAutoObservable } from "mobx";
import { fetchMovies } from "../api/movieList";

class Answer {
  isVisible: boolean = false;
  moviesArray: string[] = [];
  overview: string[] = [];
  showingOverview: string = "";
  arrayIndex: number[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchData = async () => {
    localStorage.setItem("correctAnswers", JSON.stringify(0));
    const fetchedMovies = await fetchMovies();

    this.moviesArray = fetchedMovies.map((item) => item.original_title);
    this.overview = fetchedMovies.map((item) => item.overview);

    this.isVisible = false;

    return true;
  };

  loadMovie = (moviesLoaded: boolean, index: number) => {
    const answerArray = [];
    let indexEnable = 0;
    if (moviesLoaded) {
      const overviewIndex = this.overview[index];
      const half = Math.floor(overviewIndex?.length / 2);
      const middleSpace = overviewIndex?.indexOf("", half);

      this.showingOverview =
        this.overview[index]?.slice(
          0,
          !overviewIndex[middleSpace - 1].match(/[a-zA-Z]/)
            ? middleSpace - 1
            : middleSpace
        ) + "...";

      const movie = this.moviesArray[index];

      const getRandomIndex = () => {
        const randomIndex = Math.floor(Math.random() * movie?.length);

        if (indexes.includes(randomIndex)) {
          getRandomIndex();
        } else {
          indexes.push(randomIndex);
        }
      };

      let counter = 0;

      const indexes: number[] = [];

      for (let i = 0; i < movie?.split("").length; i++) {
        const letter = movie?.split("")[i];

        if (!letter.match(/[a-zA-Z]/) && !indexes.includes(i)) {
          indexes.push(i);
        }

        if (counter < Math.floor(movie?.split("").length / 2)) {
          getRandomIndex();
          counter++;
        }
      }
      const indexesOnly = Array.from(new Set(indexes.sort((a, b) => a - b)));
      this.arrayIndex = indexesOnly;

      for (let index of indexesOnly) {
        answerArray.push({ index: index, value: movie[index] });

        if (indexEnable === index) {
          indexEnable++;
        }
      }
    }
    return { indexEnable, answerArray };
  };

  hint = (inputRefs: React.RefObject<(HTMLInputElement | null)[]>) => {
    for (let i = 0; i < inputRefs.current!.length; i++) {
      if (!inputRefs.current![i]?.value) {
        inputRefs.current![i]?.focus();
        break;
      }
    }

    this.isVisible = !this.isVisible;
  };
}

export const answerServiсe = new Answer();

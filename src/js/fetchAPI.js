export default class Gallery{
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.amountEl = 0;
    }

    fetchGallery() {
        const URL = "https://pixabay.com/api/";
        const KEY ="26705827-e07885d0f867327c6c3f35c60" 
        return fetch(`${URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
            .then(res => res.json())
            .then(data => {
                this.incrementPage();                
                this.amountEl += data.hits.length;
                return data;
            })
    }

    get query() {
        return this.searchQuery
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
    resentAmount() {
        this.amountEl = 0;
    }
  
}


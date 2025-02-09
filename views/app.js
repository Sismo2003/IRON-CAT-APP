class loader {

    // This is the url filter for the function
    #mapper = {
        'dashboard': './pages/dashboards/dashboards-main.php',
        'about': './pages/pages/pages-about.php',
        'contact': './pages/pages/pages-contact.php',
        '404': './pages/pages/pages-404.php',
    }

    #url = '';
    #screen = null;
    #screen_load = null;
    #attemps = 0;

    // class contructor
    constructor(url) {
        // get the loading screen element
        this.#screen = document.getElementById('mainConteiner');
        this.#screen_load = document.getElementById('loading-screen');
        // get the main container element
        this.#url = url.toLowerCase();

        this.#show()
        this.#sanitizer();
        this.#hide();

    }

    #show() {
        this.#screen_load.classList.add('flex');
        this.#screen_load.classList.remove('hidden');
    }

    #hide() {
        this.#screen_load.classList.remove('flex');
        this.#screen_load.classList.add('hidden');
    }

    #sanitizer() {
       let id = this.#url[0] + this.#url[1];
       // console.log("identifier : ",id);

       if(id == './'){
           this.#show();
           this.#load();
           this.#hide();
       }
       else{
           Object.entries(this.#mapper).forEach(([key, value]) => {
               // console.log(key, value);
               //this will happened when the url comes to a predefined page
               if(key == this.#url){
                   // console.log("loading page : ",key);
                   this.#url = value;
                   this.#show();
                   this.#load();
                   this.#hide();
               }
           });
       }

    }



    #load() {
        this.#attemps++;
        fetch(this.#url)
            .then(response => {
                // Verificamos si la respuesta es 404
                if (!response.ok) {
                    if (response.status === 404) {
                        // Lanza un error para que salte al .catch
                        throw new Error('404');
                    }
                    // Para otros códigos de error
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return response.text();
            })
            .then(data => {
                // Mostramos el contenido
                this.#screen.innerHTML = data;
            })
            .catch(error => {
                console.log("Error : ", error);
                if (error.message === '404') {
                    // Manejamos otros errores
                    console.error(error);
                    this.#url = this.#mapper['404'];
                    if (this.#attemps > 3) {
                        console.log("Intentos agotados");
                        return;
                    } else {
                        this.#load();
                    }
                }
            });
    }
}






window.addEventListener("load", function (event) {

    /**
     * Gestion du storage
     * @type {{saveStorage: saveStorage, getStorage: getStorage}}
     */
    var storage = {

        /**
         *  Sauvegarde la donnée passé en paramètre (item) dans le localstorage sous le nom de propriété key passé lui aussi en paramètre
         * @param key
         * @param item
         */
        saveStorage: function (key, item) {
            localStorage.setItem(key, JSON.stringify(item))
        },

        /**
         * Récupère le contenu associé à la clé key passé en paramètre du localstorage
         * @param key
         * @returns {*}
         */
        getStorage: function (key) {
            if(localStorage.getItem(key))
                return JSON.parse(localStorage.getItem(key));
            if(key === 'environnment'){
                return [];
            }
            return null;
        }
    }

    /**
     * Outil de liaison entre le storage et VueJS
     * @type {{data: *, getEnvironment: (function(): *), addEnvironnment: addEnvironnment, removeEnvironnment: removeEnvironnment, saveEnvironnment: saveEnvironnment, toggleEditMode(*): void}}
     */
    var store = {

        /**
         * Donnée de l'application nécessaire pour le fonctionnement de la page
         */
        data : storage.getStorage("environnment"),

        /**
         * Récupère la liste de tous les environnements
         * @returns {*}
         */
        getEnvironment: function () {
            return this.data;
        },

        /**
         * Ajoute un environnement dans le storage et dans l'objet data
         * @param item
         */
        addEnvironnment: function (item) {
            this.data.push(item);
            storage.saveStorage("environnment", this.data);
        },

        /**
         * Supprime un environnement du le storage et de l'objet data
         * @param item
         */
        removeEnvironnment: function (item) {
            this.data.splice(this.data.indexOf(item), 1);
            storage.saveStorage("environnment", this.data)
        },

        /**
         * Permet de sauvegarder l'objet data dans le storage
         */
        saveEnvironnment : function(){
            storage.saveStorage("environnment", this.data)
        },

        /**
         * Active le mode d'édition sur un item
         * @param item
         */
        toggleEditMode(item) {
            item.edited = !item.edited;
        }
    }


    //////////////////////////////////////////////
    //                                          //
    //                 COMPONENT                //
    //                                          //
    //////////////////////////////////////////////

    /**
     * Composant de saisie/edition et visualisation de la fréquence par défaut
     */
    Vue.component('frequency-template', {

        template: "#frequency-template",

        data: function () {
            return {
                frequencyToSave: "",
                frequency: this.getFrequency(),
                shouldEdit: false
            }
        },

        methods: {
            /**
             * Sauvegarde la frequence
             */
            saveFrequency: function () {
                let value = this.frequencyToSave;
                if (!value) {
                    return;
                }
                storage.saveStorage("frequency", value)
                this.frequency = this.frequencyToSave;
            },

            /**
             * Edite la fréquence et la sauvegarde
             */
            editFrequency: function () {
                let value = this.frequency;
                if (!value) {
                    return;
                }
                storage.saveStorage("frequency", value);
                this.setShouldEdit();
            },

            /**
             * Retourne la fréquence
             * @returns {*}
             */
            getFrequency: function () {
                let frequencyStorage = storage.getStorage("frequency");
                if (frequencyStorage) {
                    return frequencyStorage;
                }
                return "";
            },

            /**
             * Active / désactive le mode édition
             */
            setShouldEdit: function () {
                this.shouldEdit = !this.shouldEdit;
            }

        }
    });



    /**
     * Composant d'édition et de visualisation des environnements
     */
    Vue.component('list', {

        props: {
            items: {
                type: Array,
                required: true,
                validator(value) {
                    return true;
                }
            },
            trash_enabled: {
                type: Boolean,
                required: true,
                default: function () {
                    return false;
                }
            },
            edit_enabled: {
                type: Boolean,
                required: true,
                default: function () {
                    return false;
                }
            }
        },


        // template associé
        template: '#list',
        methods: {
            /**
             * Supprime un environnement
             * @param item
             */
            remove: function (item) {
                store.removeEnvironnment(item);
            },

            /**
             * Active le mode edition d'un item
             * @param item
             */
            toggleEditMode: function (item) {
                store.toggleEditMode(item);
            },

            /**
             * Sauvegarde un item
             * @param item
             */
            saveItem: function (item) {
                store.saveEnvironnment();
                store.toggleEditMode(item);

            },

        }
    });




    /**
     * Composant d'ajout d'un environnement
     */
    Vue.component('addenvironnment', {

        data: function(){
            return {
                newEnabled: false,
                environnmentToSave:{
                    name:"",
                    edited:false
                }
            }
        },

        template: '#addenvironnment',
        methods: {

            /**
             * Active le mode de création d'un environnement
             */
            toggleNewMode: function () {
                this.newEnabled = ! this.newEnabled;
            },

            /**
             * Sauvegarde un item créé
             */
            saveNewItem:function () {
                store.addEnvironnment(this.environnmentToSave);
                this.environnmentToSave = {
                    name:'',
                    edited:false
                }
                this.toggleNewMode();
            }
        }
    });


    var app = new Vue({
        el: '#app',
        data: {

            items: store.data,                  // données de l'application
            trash_activated: true,              // Spécifie si on active ou non la possibilité de supprimer un item
            edit_activated: true                // Spécifie si on active ou non la possibilité d'editer un item
        }

    });


})
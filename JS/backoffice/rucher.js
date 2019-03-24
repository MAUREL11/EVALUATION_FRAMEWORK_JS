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
            return []
        }
    }

    /**
     * Outil de liaison entre le storage et VueJS
     * @type {{data: *, getRucher: (function(): *), addRucher: addRucher, removeRucher: removeRucher, saveRucher: saveRucher, toggleEditMode(*): void}}
     */
    var store = {

        /**
         * Donnée de l'application nécessaire pour le fonctionnement de la page
         */
        data : storage.getStorage("rucher"),

        /**
         * Récupère la liste de tous les ruchers
         * @returns {*}
         */
        getRucher: function () {
            return this.data;
        },

        /**
         * Ajoute un rucher dans le storage et dans l'objet data
         * @param item
         */
        addRucher: function (item) {
            this.data.push(item);
            storage.saveStorage("rucher", this.data);
        },

        /**
         * Supprime un rucher du le storage et de l'objet data
         * @param item
         */
        removeRucher: function (item) {
            this.data.splice(this.data.indexOf(item), 1);
            storage.saveStorage("rucher", this.data)
        },

        /**
         * Permet de sauvegarder l'objet data dans le storage
         */
        saveRucher : function(){
            storage.saveStorage("rucher", this.data)
        },

        /**
         * Active le mode d'édition sur un item
         * @param item
         */
        toggleEditMode(item) {
            item.edited = !item.edited;
        },


    }


    //////////////////////////////////////////////
    //                                          //
    //                 COMPONENT                //
    //                                          //
    //////////////////////////////////////////////


    /**
     * Composant d'édition et de visualisation des ruchers
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
             * Supprime un rucher
             * @param item
             */
            remove: function (item) {
                store.removeRucher(item);
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
                store.saveRucher();
                store.toggleEditMode(item);

            },

        }
    });




    /**
     * Composant d'ajout d'un rucher
     */
    Vue.component('addrucher', {


        data: function(){
            return {
                newEnabled: false,
                rucherToSave:{
                    id:"",
                    nbRuche: null,
                    lieuImplantation: "",
                    historiqueVisite: [],
                    frequencePersonnalise: null,
                    dateCreation: new Date(),
                    name:"",
                    edited:false,
                    show:false
                }
            }
        },

        // template associé
        template: '#addrucher',
        methods: {
            /**
             * Active le mode de création d'un rucher
             */
            toggleNewMode: function () {
                this.newEnabled = ! this.newEnabled;
            },

            /**
             * Sauvegarde un item créé
             */
            saveNewItem:function () {
                store.addRucher(this.rucherToSave);
                this.rucherToSave = {
                    id:"",
                    nbRuche: null,
                    lieuImplantation: "",
                    historiqueVisite: [],
                    frequencePersonnalise: null,
                    dateCreation: new Date(),
                    name:"",
                    edited:false,
                    show:false
                }
                this.toggleNewMode();
            }
        }
    });


    var app = new Vue({
        el: '#app',
        data: {
            items: store.data,              // données de l'application
            trash_activated: true,          // Spécifie si on active ou non la possibilité de supprimer un item
            edit_activated: true            // Spécifie si on active ou non la possibilité d'editer un item
        }

    });


})
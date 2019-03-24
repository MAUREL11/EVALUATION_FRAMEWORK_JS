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
     * @type {{data: *, getRucher: (function(): *), addRucher: addRucher, removeRucher: removeRucher, saveRucher: saveRucher, getFrequency: (function(): *), toggleEditMode(*): void, toggleShowMode(*): void, sortRuchersByDateVisitOrCreationAndColor: sortRuchersByDateVisitOrCreationAndColor, selectColorForItem: selectColorForItem}}
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
         * Récupère la fréquence par défaut
         * @returns {*}
         */
        getFrequency: function(){
            return storage.getStorage("frequency");
        },

        /**
         * Active le mode d'édition sur un item
         * @param item
         */
        toggleEditMode(item) {
            item.edited = !item.edited;
        },

        /**
         * Active le mode de visualisation avancé d'un item
         * @param item
         */
        toggleShowMode(item){
            item.show = !item.show
        },

        /**
         * Trie les ruchers selon la date de visite ou de création et rajoute une couleur
         * qui correspond à la priorité de visite d'un rucher
         * @param items
         * @returns {*}
         */
        sortRuchersByDateVisitOrCreationAndColor: function (items) {

            var tabAvecVisite = items.filter(function (item) {
                return item.historiqueVisite.length > 0;
            })
            var tabSansVisite = items.filter(function (item) {
                return item.historiqueVisite.length === 0;
            })

            tabAvecVisite.forEach(function (itemVisite) {
                itemVisite.historiqueVisite.sort(function (a,b) {
                    // todo changer nom ?
                    return new Date(b.dateVisite) - new Date(a.dateVisite);
                })
            })
            if(tabAvecVisite){
                tabAvecVisite.sort(function (a,b) {
                    return new Date(b.historiqueVisite[0].dateVisite) - new Date(a.historiqueVisite[0].dateVisite);
                })
            }
            tabSansVisite.sort(function (a,b) {
                return new Date(b.dateCreation) - new Date(a.dateCreation);
            })

            tabSansVisite.forEach(function (item) {
                item.color = store.selectColorForItem(item)
            })

            if(tabAvecVisite.length>0) {
                tabAvecVisite.forEach(function (item) {
                    item.color = store.selectColorForItem(item)
                })
                return tabAvecVisite.concat(tabSansVisite)
            }
            else{
                return tabSansVisite;
            }
        },

        /**
         * Choix des couleurs pour un item
         * @param item
         * @returns {string}
         */
        selectColorForItem: function (item) {
            if(item.historiqueVisite.length >0){

                item.historiqueVisite.sort(function (a,b) {
                    // todo changer nom ?
                    return new Date(b.dateVisite) - new Date(a.dateVisite);
                })
                let dateToCheck = new Date(item.historiqueVisite[0].dateVisite);
                let defaultFrequency = store.getFrequency();
                let frequencePersonnalise = item.frequencePersonnalise;
                let today = new Date();
                let nbDayBetweenTodayAndLastDate = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate()) ) /(1000 * 60 * 60 * 24))

                if(frequencePersonnalise){
                    if(Number(nbDayBetweenTodayAndLastDate)>=Number(frequencePersonnalise)){
                        return "rouge"
                    }
                    else if(Number(nbDayBetweenTodayAndLastDate) >= Number(frequencePersonnalise)/2){
                        return "orange"
                    }
                    else{
                        return "vert";
                    }
                }
                else{

                    if(Number(nbDayBetweenTodayAndLastDate)>=Number(defaultFrequency)){
                        return "rouge"
                    }
                    else if(Number(nbDayBetweenTodayAndLastDate) >= Number(defaultFrequency)/2){
                        return "orange"
                    }
                    else{
                        return "vert";
                    }
                }
            }
            else{
                let dateToCheck = new Date(item.dateCreation);
                let today = new Date();
                let defaultFrequency = this.getFrequency();
                let nbDayBetweenTodayAndLastDate = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate()) ) /(1000 * 60 * 60 * 24))

                if(nbDayBetweenTodayAndLastDate>=defaultFrequency){
                    return "rouge"
                }
                else if(nbDayBetweenTodayAndLastDate >= defaultFrequency/2){
                    return "orange"
                }
                else{
                    return "vert";
                }
            }
        }
    }


    //////////////////////////////////////////////
    //                                          //
    //                 COMPONENT                //
    //                                          //
    //////////////////////////////////////////////

    /**
     * Composant de visualisation des ruchers
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
            },
            show_enabled: {
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
             * Active le mode visualisation d'un item
             * @param item
             */
            toggleShowMode: function(item){
                store.toggleShowMode(item);
            },

            /**
             * Sauvegarde un item
             * @param item
             */
            saveItem: function (item) {
                store.saveRucher();
                store.toggleEditMode(item);

            },

            /**
             * Retourne la couleur associé à un item
             * @param item
             * @returns {*|string}
             */
            showColorForItem: function (item) {
                return store.selectColorForItem(item);
            }

        }
    });







    var app = new Vue({
        el: '#app',
        data: {
            items: store.sortRuchersByDateVisitOrCreationAndColor(store.data),      // données de l'application
            trash_activated: false,             // Spécifie si on active ou non la possibilité de supprimer un item
            edit_activated: false,              // Spécifie si on active ou non la possibilité d'editer un item
            show_activated: true                // Spécifie si on active ou non la possibilité de visualiser un item
        },



    });


})
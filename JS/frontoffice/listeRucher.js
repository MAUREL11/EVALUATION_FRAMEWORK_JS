window.addEventListener("load", function (event) {


    var storage = {
        saveStorage: function (key, item) {
            localStorage.setItem(key, JSON.stringify(item))
        },
        getStorage: function (key) {
            if(localStorage.getItem(key))
                return JSON.parse(localStorage.getItem(key));
            return []
        }
    }

    var store = {

        data : storage.getStorage("rucher"),


        getRucher: function () {
            return this.data;
        },
        addRucher: function (item) {
            this.data.push(item);
            storage.saveStorage("rucher", this.data);
        },
        removeRucher: function (item) {
            this.data.splice(this.data.indexOf(item), 1);
            storage.saveStorage("rucher", this.data)
        },
        saveRucher : function(){
            storage.saveStorage("rucher", this.data)
        },
        getFrequency: function(){
            return storage.getStorage("frequency");
        },
        toggleEditMode(item) {
            item.edited = !item.edited;
        },
        toggleShowMode(item){
            item.show = !item.show
        },

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
            remove: function (item) {

                store.removeRucher(item);

            },
            toggleEditMode: function (item) {
                store.toggleEditMode(item);
            },
            toggleShowMode: function(item){
                store.toggleShowMode(item);
            },
            saveItem: function (item) {
                store.saveRucher();
                store.toggleEditMode(item);

            },
            showColorForItem: function (item) {
                return store.selectColorForItem(item);
            }

        }
    });







    var app = new Vue({
        el: '#app',
        data: {
            // items: store.data,
            items: store.sortRuchersByDateVisitOrCreationAndColor(store.data),
            trash_activated: false,
            edit_activated: false,
            show_activated: true
        },



    });


})
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
        toggleEditMode(item) {
            item.edited = !item.edited;
        },


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
            saveItem: function (item) {
                store.saveRucher();
                store.toggleEditMode(item);

            },

        }
    });





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
            toggleNewMode: function () {
                this.newEnabled = ! this.newEnabled;
            },
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
            items: store.data,
            trash_activated: true,
            edit_activated: true
        }

    });


})
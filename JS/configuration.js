window.addEventListener("load", function (event) {

    var storage = {
        saveStorage: function (key, item) {
            localStorage.setItem(key, JSON.stringify(item))
        },
        getStorage: function (key) {
            if(localStorage.getItem(key))
                return JSON.parse(localStorage.getItem(key));
            if(key === 'environnment'){
                return [];
            }
            return null;
        }
    }

    var store = {
        data: [
            {
                name: "test env 1",
                edited: false
            },
            {
                name: "test env 2",
                edited: false
            }
        ],
        //data : storage.getStorage("environnment")

        getEnvironment: function () {
            return this.data;
        },
        addEnvironnment: function (item) {
            this.data.push(item);
            storage.saveStorage("environnment", this.data);
        },
        removeEnvironnment: function (item) {
            this.data.splice(this.data.indexOf(item), 1);
            storage.saveStorage("environnment", this.data)
        },
        saveEnvironnment : function(){
            storage.saveStorage("environnment", this.data)
        },
        toggleEditMode(item) {
            item.edited = !item.edited;
        }
    }


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
            saveFrequency: function () {
                let value = this.frequencyToSave;
                if (!value) {
                    return;
                }
                storage.saveStorage("frequency", value)
                this.frequency = this.frequencyToSave;
            },

            editFrequency: function () {
                let value = this.frequency;
                if (!value) {
                    return;
                }
                storage.saveStorage("frequency", value);
                this.setShouldEdit();
            },

            getFrequency: function () {
                let frequencyStorage = storage.getStorage("frequency");
                if (frequencyStorage) {
                    return frequencyStorage;
                }
                return "";
            },

            setShouldEdit: function () {
                this.shouldEdit = !this.shouldEdit;
            }

        }
    });



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

                store.removeEnvironnment(item);

            },
            toggleEditMode: function (item) {
                store.toggleEditMode(item);
            },
            saveItem: function (item) {
                store.saveEnvironnment();
                store.toggleEditMode(item);

            },

        }
    });





    Vue.component('addenvironnment', {

        // props: {
        //     items: {
        //         type: Array,
        //         required: true,
        //         validator(value) {
        //             return true;
        //         }
        //     },
        //
        // },
        data: function(){
            return {
                newEnabled: false,
                environnmentToSave:{
                    name:"",
                    edited:false
                }
            }
        },

        // template associé
        template: '#addenvironnment',
        methods: {
            toggleNewMode: function () {
                this.newEnabled = ! this.newEnabled;
            },
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
            items: store.data,
            trash_activated: true,
            edit_activated: true
        }

    });


})
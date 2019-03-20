window.addEventListener("load", function (event) {

    var storage = {
        saveStorage: function (key, item) {
            localStorage.setItem(key, item)
        },
        getStorage: function (key) {
            return localStorage.getItem(key);
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
                if(frequencyStorage){
                    return frequencyStorage;
                }
                return "";
            },

            setShouldEdit : function () {
                this.shouldEdit = !this.shouldEdit;
            }

        }
    });


    var app = new Vue({
        el: '#app',
        data: {},
        methods: {}

    });


})
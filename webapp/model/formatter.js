sap.ui.define([], function () {
    "use strict";

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
        numberUnit: function (sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },

        formatState(sValue) {
            let fValue = parseFloat(sValue),
                sState = "Error"

            if (fValue > 300000)
                sState = "Success";

            return sState;
        },
        renkBelirle(sValue) {
            let fValue = parseFloat(sValue),
                sState = "Error"

            if (fValue > 300000)
                sState = "Success";

            return sState;
        },

        formatStatu: function (sKalab, sKains, sKaspe) {

            if (!isNaN(parseFloat(sKalab)) && parseFloat(sKalab) === 1)
                return this.getResourceBundle().getText("Kalab");
            else if (!isNaN(parseFloat(sKains)) && parseFloat(sKains) === 1)
                return this.getResourceBundle().getText("Kains");
            else if (!isNaN(parseFloat(sKaspe)) && parseFloat(sKaspe) === 1)
                return this.getResourceBundle().getText("Kaspe");

        },

        formatStatuState: function (sKalab, sKains, sKaspe) {

            if (!isNaN(parseFloat(sKalab)) && parseFloat(sKalab) === 1)
                return "Success";
            else if (!isNaN(parseFloat(sKains)) && parseFloat(sKains) === 1)
                return "Warning";
            else if (!isNaN(parseFloat(sKaspe)) && parseFloat(sKaspe) === 1)
                return "Error";
        },

        formatStatuIcon: function (sKalab, sKains, sKaspe) {
            if (!isNaN(parseFloat(sKalab)) && parseFloat(sKalab) === 1)
                return "sap-icon://shipping-status";
            else if (!isNaN(parseFloat(sKains)) && parseFloat(sKains) === 1)
                return "sap-icon://alert";
            else if (!isNaN(parseFloat(sKaspe)) && parseFloat(sKaspe) === 1)
                return "sap-icon://error";
        },



    };

});
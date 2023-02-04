sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    'sap/m/MessageToast',
    "sap/ui/model/Sorter",
    "../model/formatter",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, UIComponent, MessageToast, Sorter, formatter, History) {
        "use strict";

        return Controller.extend("tirsan.fioriegitim3.controller.ListDetail", {
            formatter: formatter,

            onInit: function () {
                var table = this.byId("table"),
                    tableTemp = this.tableTemp = table.getBindingInfo("items").template;

                table.unbindAggregation("items");

                this.getRouter().getRoute("ListDetail").attachPatternMatched(this._onMatched, this);
            },

            _onMatched: function (oEvent) {
                var oArgs = oEvent.getParameter("arguments");
                var oQuery = oArgs["?query"];

                oQuery.Matnr = window.decodeURIComponent(oQuery.Matnr);

                this._readVehicleStock(oQuery.Werks, oQuery.Matnr);
            },

            _readVehicleStock: function (sWerks, sMatnr) {
                var oFilter = [new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.EQ, sWerks),
                new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, sMatnr)];


                this.byId("table").setBusy(true);

                this.getModel().read("/EDataSet", {
                    filters: oFilter,
                    success: $.proxy(function (oData, response) {
                        var table = this.byId("table");
                        table.unbindAggregation("items");

                        table.setModel(new sap.ui.model.json.JSONModel(oData.results));
                        table.bindAggregation("items", {
                            path: "/",
                            template: this.tableTemp,
                            templateShareable: true
                        });
                        this.byId("table").setBusy(false);
                    }, this)
                });
            },

            onTitlePress: function (oEvent) {
                MessageToast.show("Sipariş No:" + oEvent.getSource().getBindingContext().getObject().Vbeln);
            },

            onKunnrPress: function (oEvent) {
                let sKunnr = oEvent.getSource().getBindingContext().getObject().Kunnr;

                this._cfMusteriAciklama(sKunnr);
            },

            onNavBack: function () {
                var sPreviousHash = History.getInstance().getPreviousHash();
                if (sPreviousHash !== undefined) {
                    // eslint-disable-next-line sap-no-history-manipulation
                    history.go(-1);
                } else {
                    this.getRouter().navTo("RouteList");
                }
            },

            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            getModel: function (sName) {
                return this.getView().getModel(sName);
            },

            getResourceBundle: function () {
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },

            _cfMusteriAciklama: function (sKunnr) {
                sap.ui.core.BusyIndicator.show();

                this.getModel().callFunction("/MusteriDetay", {
                    method: "POST",
                    urlParameters: {
                        Kunnr: sKunnr,
                    },
                    success: $.proxy(function (oData, oResponse) {
                        debugger;
                        sap.ui.core.BusyIndicator.hide();

                    }, this)

                });
            },

        });
    });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    'sap/m/MessageToast',
    "sap/ui/model/Sorter",
    "../model/formatter",
    "sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, UIComponent, MessageToast, Sorter,formatter,History,Filter,FilterOperator) {
        "use strict";

        return Controller.extend("tirsan.fioriegitim3.controller.List", {
            formatter: formatter,

            onInit: function () {

                    
                var vehicleList = this.byId("vehicleList"),
                vehicleListTemp = this.vehicleListTemp = vehicleList.getBindingInfo("items").template;

                vehicleList.unbindAggregation("items");

                this._unbindAgg();

                this.getRouter().getRoute("RouteList").attachPatternMatched(this._onMatched, this);
            },
            
            handleChange: function (oEvent) {
                var oValidatedComboBox = oEvent.getSource(),
                    sValue = oValidatedComboBox.getValue();
    
                    
            //    MessageToast.show("Seçtiğiniz sValue: " + sValue);

               // this._readVehicleStock(sValue)

               this._filterVehicleList(sValue);
               
            },


          
            _unbindAgg:function(){

           

                var cbxVkgrp = this.byId("cbxVkgrp"),
                cbxVkgrpTemp = this.cbxVkgrpTemp = cbxVkgrp.getBindingInfo("items").template;
                cbxVkgrp.unbindAggregation("items");
                





            },

            _onMatched: function () {
                this._readVehicleStock("");
            },

            _readVehicleStock: function (getVal) {
                sap.ui.core.BusyIndicator.show();


                let _getVal = getVal;
                    
                MessageToast.show("Yükleniyor: " + _getVal);

      

                this.getModel().read("/EDataSet", {
               
                    success: $.proxy(function (oData, response) {
                        debugger;



                        let aData = oData.results.reduce((acc, x) => {

                            if (acc.find(y => y.Matnr === x.Matnr && y.Werks === x.Werks))
                                return acc.concat([]);

                            let aFilteredData = oData.results.filter(y => y.Matnr === x.Matnr && y.Werks === x.Werks);
                            var oReturn = {};

                            if (aFilteredData.length > 1) {
                                oReturn = aFilteredData.reduce((a, b) => {

                                    let Netwr = 0,
                                        Toplam = 0;

                                    let fNetwr1 = (isNaN(parseFloat(a.Netwr))) ? 0 : parseFloat(a.Netwr);
                                    let fNetwr2 = (isNaN(parseFloat(b.Netwr))) ? 0 : parseFloat(b.Netwr);

                                    Netwr = fNetwr1 + fNetwr2;

                                    let fToplam1 = (isNaN(parseFloat(a.Toplam))) ? 0 : parseFloat(a.Toplam);
                                    let fToplam2 = (isNaN(parseFloat(b.Toplam))) ? 0 : parseFloat(b.Toplam);

                                    Toplam = fToplam1 + fToplam2;

                                    return {
                                        Netwr: Netwr,
                                        Toplam: Toplam
                                    }

                                });
                            } else {
                                oReturn.Netwr = parseFloat(x.Netwr);
                                oReturn.Toplam = parseFloat(x.Toplam);
                            }


                            var icon = "sap-icon://building",
                                flag = "Flagged"
                            if (x.Werks === "1100" || x.Werks === "2100" || x.Werks === "2502") {
                                icon = "sap-icon://factory";
                                flag = "Favorite"
                            }

                            let Werks = x.Werks,
                                Matnr = x.Matnr,
                                Waerk = x.Waerk,
                                Name1 = x.Name1,
                                Kunnr = x.Kunnr,
                                Vkgrp = x.Vkgrp,
                                NetwrT = oReturn.Netwr,
                                ToplamT = oReturn.Toplam,
                                Sort = NetwrT + Matnr;


                            return acc.concat([{
                                Werks,
                                Matnr,
                                Waerk,
                                Name1,
                                Kunnr,
                                Vkgrp,
                                NetwrT,
                                ToplamT,
                                Sort,
                                icon,
                                flag
                            }])

                        }, []);

                        var vehicleList = this.byId("vehicleList");
                        vehicleList.unbindAggregation("items");

                       
                         /*    let tabloyaGidecek =aData;

                          if(_getVal.length > 0){
                            tabloyaGidecek = _.filter(aData,{ 'Vkgrp' : _getVal });

                          } */

                        vehicleList.setModel(new JSONModel(aData));
                        vehicleList.bindAggregation("items", {
                            path: "/",
                            template: this.vehicleListTemp,
                            templateShareable: true
                        });

                        var oSorter = new Sorter({
                            path: 'Sort',
                            descending: false
                        });

                        vehicleList.getBinding("items").sort(oSorter);

debugger;

                        var oCData = _.unionBy(oData.results,"Vkgrp");

                     //       oCData = _.sortBy(oCData.results,"Vkgrp");


                     var oSorterVkgrp = new Sorter({
                        path: 'Vkgrp',
                        descending: false
                    });
 

                        var cbxVkgrp = this.byId("cbxVkgrp");
                        cbxVkgrp.unbindAggregation("items");    
                        cbxVkgrp.setModel(new JSONModel(oCData));
                        cbxVkgrp.bindAggregation("items", {
                        path: "/",
                        sorter:oSorterVkgrp,
                        template: this.cbxVkgrpTemp,
                        templateShareable: true
                        });









                        sap.ui.core.BusyIndicator.hide();
                    }, this)
                });
            },
            
            _filterVehicleList:function(sValue){

            // build filter array
			var aFilter = [];
			//var sQuery = oEvent.getParameter("query"); //search field veri alir.
			
            if (sValue) {
				aFilter.push(new Filter("Vkgrp", FilterOperator.EQ, sValue));
			}

			// filter binding
			var oList = this.byId("vehicleList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);


            }
            
            ,

            onPress: function (oEvent) {
                let _q = oEvent.getSource().getBindingContext().getObject();
                
                this.getRouter().navTo("ListDetail", {
                    query: {
                        Werks: _q.Werks,
                        Matnr: window.encodeURIComponent(_q.Matnr)
                    }
                });
            },

            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            getModel: function (sName) {
                return this.getView().getModel(sName);
            },

        });
    });

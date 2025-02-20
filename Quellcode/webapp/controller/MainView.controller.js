sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("odataapp.controller.MainView", {
            onInit: function () {

            },

            onAddFlightPress:function() {
                var oView = this.getView();

                // create dialog lazily
                if (!this.byId("helloDialog")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        type: "XML",
                        name: "odataapp.view.fragments.Dialog",
                        controller: this
                    }).then(function (oDialog) {
                        // connect dialog to the root view of this component (models, lifecycle)
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else {
                    this.byId("helloDialog").open();
                }                
            },
            
            onAfterOpen: function() {
                var oModel = this.getView().getModel();
                //this.oNewCreateContext = oModel.createEntry("/SFlightSet",{properties: {Mandt: "002", Carrid: "AA", Connid:"0876", Fldate: new Date(), "Seatsmax": 9999}});                
                this.oNewCreateContext = oModel.createEntry("/SFlightSet");                
                var sPath = this.oNewCreateContext.getPath();
                this.byId("helloDialog").bindElement(sPath);                
            },
            
            onSmartFormCheck: function(oEvent) {
                var oSmartForm = this.byId("idSmartForm");
                this._aErroneousFields = oSmartForm.check();
                this.idOkButton = this.byId("idOkButton");
                if (this._aErroneousFields.length > 0) {
                    this.idOkButton.setEnabled(false);
                } else {
                    this.idOkButton.setEnabled(true);
                }
            },
            
            onPressOk:function() {
                var oModel = this.getView().getModel();
                var oDialog = this.byId("helloDialog");

                oModel.submitChanges({
                    success:  function(oData)  {
                        sap.m.MessageBox.information("Create war Erfolgreich");
                        oDialog.close()
                    },
                    error: function (oError) {
                        sap.m.MessageBox.information("Fehler beim Create");
                    }
                });		 

/*                 oModel.create("/SFlightSet", oNewObject, {
                    success:  function(oData)  {
                        sap.m.MessageBox.information("Create war Erfolgreich");
                        oDialog.close()
                    },
                    error: function (oError) {
                        sap.m.MessageBox.information("Fehler beim Create");
                    }
                });		 */                
            },

            onPressCancel:function() {
                var oModel = this.getView().getModel();
                if (oModel.hasPendingChanges()) {
                    oModel.resetChanges(undefined, true);
                }
                this.byId("helloDialog").close()
            }

        });
    });

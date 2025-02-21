sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageToast, MessageBox, Fragment) {
        "use strict";

        return Controller.extend("odataapp.controller.MainView", {
            
            onInit: function () {
                this._wizard = this.byId("CreateProductWizard");
                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");
    
                Fragment.load({
                    name: "odataapp.view.ReviewPage",
                    controller: this
                }).then(function (oWizardReviewPage) {
                    this._oWizardReviewPage = oWizardReviewPage;
                    this._oNavContainer.addPage(this._oWizardReviewPage);
                }.bind(this));

                var oPage = this.getView().byId("wizardContentPage");
                var oModel = this.getOwnerComponent().getModel();
                //oModel.attachMetadataLoaded(this.onAfterLoaded.bind(this), this);
            },

            onAfterRendering: function() {
                var oModel = this.getOwnerComponent().getModel();
                var oNewContext = oModel.createEntry("ScarrSet");
                var sPath = oNewContext.getPath();
                var oPage = this.getView().byId("wizardContentPage");
                oPage.bindElement(sPath);

                var oNewEntry = 
                {
                    "Mandt": "002",
                    "Carrid" : "AA",
                    "HeaderToItem" : [
                        {
                          "Mandt": "002",
                          "Carrid" : "AA",
                          "Connid" : "0123",
                        },
                      ]
                };
                oModel.create("/ScarrSet", oNewEntry, {
                    success:  function(oData)  {
                        alert("Create war Erfolgreich");
                        that.onCloseDialog();
                    },
                    error: function (oError) {
                        alert("Fehler beim Create");
                    }
                });	                
            },
    
            setProductType: function (evt) {
                var productType = evt.getSource().getTitle();
                //this.model.setProperty("/productType", productType);
                this.byId("ProductStepChosenType").setText("Chosen product type: " + productType);
                this._wizard.validateStep(this.byId("ProductTypeStep"));
            },
    
            setProductTypeFromSegmented: function (evt) {
                var productType = evt.getParameters().item.getText();
                //this.model.setProperty("/productType", productType);
                this._wizard.validateStep(this.byId("ProductTypeStep"));
            },
    
            additionalInfoValidation: function () {
                this._wizard.validateStep(this.byId("ProductInfoStep"));

            },
    
            optionalStepActivation: function () {
                MessageToast.show(
                    'This event is fired on activate of Step3.'
                );
            },
    
            optionalStepCompletion: function () {
                MessageToast.show(
                    'This event is fired on complete of Step3. You can use it to gather the information, and lock the input data.'
                );
            },
    
            pricingActivate: function () {
                //this.model.setProperty("/navApiEnabled", true);
            },
    
            pricingComplete: function () {
                //this.model.setProperty("/navApiEnabled", false);
            },
    
            scrollFrom4to2: function () {
                this._wizard.goToStep(this.byId("ProductInfoStep"));
            },
    
            goFrom4to3: function () {
                if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
                    this._wizard.previousStep();
                }
            },
    
            goFrom4to5: function () {
                if (this._wizard.getProgressStep() === this.byId("PricingStep")) {
                    this._wizard.nextStep();
                }
            },
    
            wizardCompletedHandler: function () {
                this._oNavContainer.to(this._oWizardReviewPage);
            },
    
            backToWizardContent: function () {
                this._oNavContainer.backToPage(this._oWizardContentPage.getId());
            },
    
            editStepOne: function () {
                this._handleNavigationToStep(0);
            },
    
            editStepTwo: function () {
                this._handleNavigationToStep(1);
            },
    
            editStepThree: function () {
                this._handleNavigationToStep(2);
            },
    
            editStepFour: function () {
                this._handleNavigationToStep(3);
            },
    
            _handleNavigationToStep: function (iStepNumber) {
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);
    
                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this.backToWizardContent();
            },
    
            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._handleNavigationToStep(0);
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                        }
                    }.bind(this)
                });
            },
    
            _setEmptyValue: function (sPath) {
                //this.model.setProperty(sPath, "n/a");
            },
    
            handleWizardCancel: function () {
                this._handleMessageBoxOpen("Are you sure you want to cancel your report?", "warning");
            },
    
            handleWizardSubmit: function () {
                this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");
            },
    
            productWeighStateFormatter: function (val) {
                return isNaN(val) ? "Error" : "None";
            },
    
            discardProgress: function () {
                this._wizard.discardProgress(this.byId("ProductTypeStep"));
    
                var clearContent = function (content) {
                    for (var i = 0; i < content.length; i++) {
                        if (content[i].setValue) {
                            content[i].setValue("");
                        }
    
                        if (content[i].getContent) {
                            clearContent(content[i].getContent());
                        }
                    }
                };
    
                //this.model.setProperty("/productWeightState", "Error");
                //this.model.setProperty("/productNameState", "Error");
                clearContent(this._wizard.getSteps());
            }
        });
    });

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc2/doc/">App SDK 2.0rc2 Docs</a>'},
    launch: function() {
        console.log("Angelo's First Rally Grid App!");
        //this.noRecordsUpdated = 0;
        //this.noUpdateErrors = 0;
        this._loadData();
    },
    
    //Get data from Rally
    _loadData: function() {
        var myStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'User Story',
            pageSize: 300,
            autoLoad: true,
            filters: [
                {
                    property: 'ScheduleState',
                    operator: '!=',
                    value: 'Accepted'
                }
            ],
            listeners: {
                load: function(store, data, success) {
                    console.log('got data!', store, data, success);
                    this._createSetTDCReadyButton(myStore);
                    // this._iterateOverStore(myStore);
                    this._loadGrid(myStore);
                },
                scope:this
            },
            fetch: ['FormattedID', 'Name', 'ScheduleState', 'Ready', 'TDCReady']
        });
        this.MyDataStore = myStore;
    },
    
    _createSetTDCReadyButton: function() {
        console.log('in create button');
        var myButton = Ext.create('Ext.Container', {
            items: [{
                xtype: 'rallybutton',
                text: 'Set TDC Ready flag to Ready flag',
                scope: this,
                handler: function() {
                    this._iterateOverStore(this.MyDataStore);
                    // var dialogMsg = 'Done!  Records Updated: ' + this.noRecordsUpdated + ' Errors Encountered: ' + this.noUpdateErrors;
                    var dialogMsg = 'Done!';
                    Ext.Msg.alert('Button', dialogMsg);
                }
            }]
            //renderTo: Ext.getBody().dom
        });
        this.add(myButton);
    },
    
    //iterate over the store
    _iterateOverStore: function(myDataStore) {
        console.log('_iterateOverStore method called', myDataStore);
        myDataStore.each(function(item) {
            console.log('item in store', item);
            console.log('Ready', item.data.Ready, 'TDC Ready', item.data.c_TDCReady);
            if(item.data.Ready != item.data.c_TDCReady) {
                console.log("Ready and TDC Ready flags different");
                //item.data.c_TDCReady = item.data.Ready;
                item.set('TDCReady', item.data.Ready);
                console.log('tdc ready flag set to Ready flag', item);
                item.save({
                    callback: function(result,operation) {
                        if (operation.wasSuccessful()) {
                            console.log("Updated record successfully!");
                            //this.noRecordsUpdated = this.noRecordsUpdated+1;
                            //console.log('Records updated:', this.noRecordsUpdated)
                        } else {
                            console.log("Error updating record");
                            //this.noUpdateErrors = this.noUpdateErrors+1;
                            //console.log('No of errors encountered:', this.noUpdateErrors)
                        }
                    }
                });
            } else {
                console.log("Ready and TDC Ready flags are the same!!");
            }
        });
        this.remove(this.MyRallyGrid);
        this._loadGrid(myDataStore);
    },
    
    //create and show a grid of given stories
    _loadGrid: function(myStoryGrid) {
        var myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: myStoryGrid,
            columnCfgs: [
                'FormattedID', 'Name', 'ScheduleState', 'Ready', 'TDCReady'
            ]
        });
        
        this.add(myGrid);
        this.MyRallyGrid = myGrid;
        console.log('what is this?', this);
    }
});

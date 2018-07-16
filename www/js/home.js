document.addEventListener('init', function (event) {

    var page = event.target;

    if (page.id === 'home') {
        page.querySelector('#scan').onclick = function () {
            console.log('Start scan ...');
            var element = document.getElementById("devices");
            element.innerHTML = '';
            ble.startScan([], function (device) {
                console.log(JSON.stringify(device));
                var displayName;
                var deviceID = "'" + device.id + "'";
                if (device.name) {
                    displayName = device.name;
                }
                else {
                    displayName = device.id;
                }               
                var listitem =
                    '<ons-list-item>' +
                    '<div class="eft">' +
                    displayName +
                    '</div>' +
                    '<div class="right">' +
                    '<ons-button onclick="connectTo(' + deviceID + ')"> Connect </ons-button>' +
                    '</div>' +
                    '</ons-list-item>';
                var element = document.getElementById("devices");
                element.innerHTML += listitem;

            }, function (error) {
                console.log(JSON.stringify(error));
            });

            setTimeout(function () {
                ble.stopScan(
                    function () { console.log("Scan complete"); },
                    function () { console.log("stopScan failed"); }
                );
            }, 35000);
        };
    }else if (page.id == "page2") {
        var device_id = page.data.id;
        var data = page.data.data;
        $.each(data.characteristics, function(i, j){
                if (j.properties == "Notify") {
                    ble.startNotification(device_id, j.service, j.characteristic, function(buffer){
                        var data = bytesToString(buffer);
                        var render = 'Value: ' + data;
                        $('#value').html(render);     
                    }, function(error){
                        console.log(error);
                    });               
                }else if (j.properties == "Write") {
                    console.log(JSON.stringify(j));                    
                    page.querySelector('#on').onclick = function(){
                        var data = stringToBytes("ON");
                        ble.write(device_id, j.service, j.characteristic, data, function(){
                            ons.notification.alert("Success");                            
                        }, function(){
                            ons.notification.alert("Fail");    
                        }); 
                    };
                    page.querySelector('#off').onclick = function(){
                        var data = stringToBytes("OFF");
                        ble.write(device_id, j.service, j.characteristic, data, function(){
                            ons.notification.alert("Success");    
                        }, function(){
                            ons.notification.alert("Fail");    
                        }); 
                    };
                }{
                    
                }
            })   
    
    }
    

});
function connectTo(device_id) {
    console.log("Connecting...");
    var modal = document.querySelector('ons-modal');
    modal.show();
    ble.connect(device_id, function (data) {
        ble.isConnected(device_id, function () {
            console.log("Peripheral is connected");
            modal.hide(function(){
                
            });
            document.querySelector('#myNavigator').pushPage('page2.html', {data: {id: device_id, data: data}});
        }, function () {
            console.log("Peripheral is *not* connected");
        }
        );
    }, function (err) {
        console.error('error connecting to device')
        modal.hide(function(){
            ons.notification.alert('Connect Fail!');
        });
    });
}


     
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
     }
     return array.buffer;
 }

 function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}
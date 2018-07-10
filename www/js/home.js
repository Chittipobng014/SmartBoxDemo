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
                if (device.name) {
                    displayName = device.name;
                }
                else{
                    displayName = device.id;
                }
                var listitem = "<ons-list-item>" + displayName + "</ons-list-item>"
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
    }
});


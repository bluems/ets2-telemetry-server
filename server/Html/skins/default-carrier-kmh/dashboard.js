﻿Funbit.Ets.Telemetry.Dashboard.prototype.initialize = function (skinConfig, utils) {
    //
    // skinConfig - a copy of the skin configuration from config.json
    // utils - an object containing several utility functions (see skin tutorial for more information)
    //

    // this function is called before everything else, 
    // so you may perform any DOM or resource initializations / image preloading here

    utils.preloadImages([
        'images/bg-off.png', 'images/bg-on.png',
        'images/blinker-left-off.png', 'images/blinker-left-on.png',
        'images/blinker-right-off.png', 'images/blinker-right-on.png',
        'images/cruise-off.png', 'images/cruise-on.png',
        'images/highbeam-off.png', 'images/highbeam-on.png',
        'images/lowbeam-off.png', 'images/lowbeam-on.png',
        'images/parklights-off.png', 'images/parklights-on.png',
        'images/trailer-off.png', 'images/trailer-on.png',
        'images/parking-off.png', 'images/parking-on.png',
        'images/speed-limit.png', 'images/airPressureEmergency-on.png',
        'images/airPressureEmergency-off.png'
    ]);

    // return to menu by a click
    /*$(document).add('body').on('click', function () {
        //window.history.back();
        var docV = document.documentElement;

        if (docV.requestFullscreen) docV.requestFullscreen();
        else if (docV.webkitRequestFullscreen) // Chrome, Safari (webkit)
            docV.webkitRequestFullscreen();
        else if (docV.mozRequestFullScreen) // Firefox
            docV.mozRequestFullScreen();
        else if (docV.msRequestFullscreen) // IE or Edge
            docV.msRequestFullscreen();
    });*/
}

Funbit.Ets.Telemetry.Dashboard.prototype.filter = function (data, utils) {
    //
    // data - telemetry data JSON object
    // utils - an object containing several utility functions (see skin tutorial for more information)
    //

    // This filter is used to change telemetry data 
    // before it is displayed on the dashboard.
    // You may convert km/h to mph, kilograms to tons, etc.

    data.hasJob = data.jobMarket != '';
    // round truck speed
    data.truck.speedRounded = Math.abs(data.truck.speed > 0
        ? Math.floor(data.truck.speed)
        : Math.round(data.truck.speed));
    data.truck.cruiseControlSpeedRounded = data.truck.cruiseControlOn
        ? Math.floor(data.truck.cruiseControlSpeed)
        : 0;
    // convert kg to t
    data.cargo.mass = data.hasJob ? (Math.round(data.cargo.mass / 1000.0) + 't') : '';
    // format odometer data as: 00000.0
    data.truck.odometer = utils.formatFloat(data.truck.odometer, 1);
    // format fuelAverageConsumption data as: 000.0
    data.truck.fuelAverageConsumption = data.truck.fuelAverageConsumption < 100
        ? data.truck.fuelAverageConsumption * 100
        : data.truck.fuelAverageConsumption * 1000;
    data.truck.fuelAverageConsumption = utils.formatFloat(data.truck.fuelAverageConsumption,2);
    // convert gear to readable format
    data.truck.gear = data.truck.displayedGear; // use displayed gear
    data.truck.gear = data.truck.gear > 0
        ? (data.truck.gear < 3 ? 'C' + data.truck.gear : 'D' + (data.truck.gear - 2))
        : (data.truck.gear < 0 ? 'R' + Math.abs(data.truck.gear) : 'N');
    // convert rpm to rpm * 100
    data.truck.engineRpm = data.truck.engineRpm / 100;
    // calculate wear
    var wearSumPercent = data.truck.wearChassis * 100;
    wearSumPercent = Math.min(wearSumPercent, 100);
    data.truck.wearSum = Math.round(wearSumPercent) + '%';
    data.cargo.damage = Math.round(data.cargo.damage * 100) + '%';
    data.navigation.estimatedDistance = Math.floor(data.navigation.estimatedDistance / 1000) + 'Km';
	
	var connectedTrailers = 0;
	wearSumPercent = 0;
	for (var i = 1; i <= data.game.maxTrailerCount; i++) {
		if (data['trailer' + i].present) {
			connectedTrailers++;
			wearSumPercent += data['trailer' + i].wearChassis * 100;
		}
	}
	data.job.trailerDamagePercent = Math.floor(wearSumPercent / connectedTrailers) + '%';
    // return changed data to the core for rendering
    return data;
};

Funbit.Ets.Telemetry.Dashboard.prototype.render = function (data, utils) {
    //
    // data - same data object as in the filter function
    // utils - an object containing several utility functions (see skin tutorial for more information)
    //

    // we don't have anything custom to render in this skin,
    // but you may use jQuery here to update DOM or CSS
}
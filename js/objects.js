const builds = {
    cardboard_box : {
        name : 'Картонная каробка',
        price : 10,
        amelioration_health : 1,
    },
    tent : {
        name : 'Палатка',
        price : 2500,
        amelioration_health : 2,
    },
    rent_room : {
        name : 'Съемная комната',
        price : 10000,
        isRent: true,
        amelioration_health : 2,
        amelioration_fun : 1,
    },
    rent_flat : {
        name: 'Съемная квартира',
        price : 25000,
        isRent: true,
        amelioration_health : 3,
        amelioration_fun : 2,
    },
    buy_flat : {
        name: 'Квартира',
        price : 25000,
        amelioration_health : 4,
        amelioration_fun : 4,
    },
    buy_house : {
        name : 'Загородный дом',
        price : 10000000,
        amelioration_health : 5,
        amelioration_fun : 5,
    }
};

const vehicles = {
    shoes : {
        price : 2000,
        name: 'Кросовки',
    },
    bike : {
        price : 12000,
        name: 'Велосипед',
    },
    cheap_car : {
        price : 250000,
        name: 'Подержанная машина',
    },
    car : {
        price : 800000,
        name: 'Машина',
    },
    cool_car : {
        price : 5000000,
        name: 'Куртая тачка',
    }
};

const position = {
    bomjara : {
        name: 'Бомжара',
        weight: 1
    },
    shaverma_man : {
        name: "Шаверма мастер",
        weight: 2
    },
    office_manager : {
        name: 'Офисный планктон',
        weight: 3
    },
    manager : {
        name: 'Старший менеджер',
        weight: 4
    },
    senior_manager : {
        name: 'Руководитель',
        weight: 5
    },
    ceo : {
        name: 'Главный из главных',
        weight: 6
    }
};

const staticBuilds = Object.freeze(builds);
const staticVehicles = Object.freeze(vehicles);
const staticPosition = Object.freeze(position);
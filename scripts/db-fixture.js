const {default: shiphold} = require('ship-hold');
const {db} = require('../src/conf').default;
const {extension: loadModels} = require('../src/db/plugins/load-models').default;
const casual = require('casual');
const {aggregate} = require('ship-hold-querybuilder');
const bcrypt = require('bcrypt');

const sh = loadModels(shiphold(db));
const userNumber = process.env.USER_NUMBER || 2000;

(async function () {
    let iter = 0;
    const Users = sh.model('Users');
    const Bikes = sh.model('Bikes');
    const Applications = sh.model('Applications');
    const Roles = sh.model('Roles');
    const BusinessOwners = sh.model('BusinessOwners');
    const Businesses = sh.model('Businesses');

    const roles = await Roles
        .select()
        .run();

    const findRole = value => roles.filter(({title}) => title === value)[0];

    const ownerRole = findRole('business_owner');
    const riderRole = findRole('rider');

    while (iter < userNumber) {
        const created_at = new Date(casual.unix_time * 1000);
        const [{id}] = await Users
            .insert({
                email: casual.email,
                created_at,
                updated_at: created_at,
                role_id: riderRole.id,
                password_hash: 'foo'
            })
            .run();
        iter++;
    }
    const businesses = [];
    for (let i = 0; i < 10; i++) {
        const created_at = new Date(casual.unix_time * 1000);
        const [owner] = await Users
            .insert({
                email: casual.email,
                created_at,
                updated_at: created_at,
                role_id: ownerRole.id,
                password_hash: bcrypt.hashSync('owner', 10)
            })
            .run();
        const [business] = await Businesses
            .insert({
                name: casual.company_name,
                created_at,
                updated_at: created_at,
            })
            .run();

        businesses.push(business);

        await BusinessOwners
            .insert({
                user_id: owner.id,
                business_id: business.id
            })
            .run();
    }

    for (let i = 0; i < 400; i++) {
        const created_at = new Date(casual.unix_time * 1000);
        const fabrication_date = new Date((new Date(1998, 1)).getTime() + casual.integer(0, 20 * 365 * 24 * 3600 * 1000));
        const acquisition_date = new Date(fabrication_date.getTime() + casual.integer(0, 10 * 365 * 24 * 3600* 1000));
        const business_id = Math.min(Math.floor(Math.random() * businesses.length) + 1, businesses.length);
        const [bike] = await Bikes
            .insert({
                created_at,
                updated_at: created_at,
                fabrication_date,
                acquisition_date,
                brand: casual.word,
                price: casual.integer(50, 500),
                business_id
            })
            .run();
    }


    sh.stop();
})();

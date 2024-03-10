import db from '$db';

export class Options {
    async init() {
        this._keys = [];

        (await db.Option.findAll()).forEach(option => {
            this._keys.push(option.name);
            this[option.name] = option.value;
        });
    }

    async set(name, value) {
        if (typeof(this[name]) === 'undefined') {
            if (typeof(value) === 'undefined')
                return;

            await db.Option.create({
                name, value
            });

            this[name] = value;
            this._keys.push(name);
            return;
        }

        const option = await db.Option.findOne({
            where: { name }
        });

        if (!option)
            throw new Error(
                'Defined option is undefined in DB, someone messed with DB'
            );

        option.value = value;
        await option.save();
        this[name] = value;
    }

    async unset(name) {
        this[name] = undefined;
        this._keys = this._keys.filter(key => key !== name);

        const option = await db.Option.findOne({
            where: { name }
        });

        if (option)
            await option.destroy();
    }

    defined(name) {
        return typeof(this[name]) !== 'undefined';
    }

    raw() {
        const rawOptions = {};
        this._keys.forEach(key => {
            rawOptions[key] = this[key];
        });

        return rawOptions;
    }
}

const options = new Options();
export default options;

const defaults = {
    siteTitle: 'MarkedCMS',
    footerCopyRight: 'Powered by MarkedCMS',
    homePageId: 0,
}

export async function initOptions() {
    await options.init();

    for (const [ name, value ] of Object.entries(defaults)) {
        if (!options.defined(name)) {
            await options.set(name, value);
        }
    }
}
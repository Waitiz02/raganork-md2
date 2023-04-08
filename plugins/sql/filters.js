const config = require('../../config');
const { DataTypes } = require('sequelize');

// Cfilter/filter
const FiltersDB = config.DATABASE.define('filter', {
    chat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pattern: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    regex: {
        type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
    }
});

async function getFilter(jid = null, filter = null) {
    var Wher = {chat: jid};
    if (filter !== null) Wher.push({pattern: filter});
    var Msg = await FiltersDB.findAll({
        where: Wher
    });

    if (Msg.length === 0) {
        return false;
    } else {
        return Msg;
    }
}


async function setFilter(jid = null, filter = null, tex = null, regx = false) {
    filter = filter.toLowerCase()
    var Msg = await FiltersDB.findAll({
        where: {
            chat: jid,
            pattern: filter
        }
    });

    if (Msg.length === 0) {
        return await FiltersDB.create({ chat: jid, pattern: filter, text: tex, regex: regx });
    } else {
        return await Msg[0].update({ chat: jid, pattern: filter, text: tex, regex: regx });
    }
}

async function deleteFilter(jid = null, filter) {
    var Msg = await FiltersDB.findAll({
        where: {
            chat: jid,
            pattern: filter
        }
    });
    if (Msg.length === 0) {
        return false;
    } else {
        return await Msg[0].destroy();
    }
}
// Gfilter
const GFiltersDB = config.DATABASE.define('gfilter', {
    pattern: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    regex: {
        type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
    }
});

async function getGFilter(filter = null) {
    var Wher = {};
    if (filter !== null) Wher.push({pattern: filter});
    var Msg = await GFiltersDB.findAll({
        where: Wher
    });

    if (Msg.length === 0) {
        return false;
    } else {
        return Msg;
    }
}


async function setGFilter(filter = null, tex = null, regx = false) {
    filter = filter.toLowerCase()
    var Msg = await GFiltersDB.findAll({
        where: {
            pattern: filter
        }
    });

    if (Msg.length === 0) {
        return await GFiltersDB.create({ pattern: filter, text: tex, regex: regx });
    } else {
        return await Msg[0].update({ pattern: filter, text: tex, regex: regx });
    }
}

async function deleteGFilter(filter) {
    var Msg = await GFiltersDB.findAll({
        where: {
            pattern: filter
        }
    });
    if (Msg.length === 0) {
        return false;
    } else {
        return await Msg[0].destroy();
    }
}
// Dfilter
const DFiltersDB = config.DATABASE.define('dfilter', {
    pattern: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    regex: {
        type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
    }
});

async function getDFilter(filter = null) {
    var Wher = {};
    if (filter !== null) Wher.push({pattern: filter});
    var Msg = await DFiltersDB.findAll({
        where: Wher
    });

    if (Msg.length === 0) {
        return false;
    } else {
        return Msg;
    }
}


async function setDFilter(filter = null, tex = null, regx = false) {
    filter = filter.toLowerCase()
    var Msg = await DFiltersDB.findAll({
        where: {
            pattern: filter
        }
    });

    if (Msg.length === 0) {
        return await DFiltersDB.create({ pattern: filter, text: tex, regex: regx });
    } else {
        return await Msg[0].update({ pattern: filter, text: tex, regex: regx });
    }
}

async function deleteDFilter(filter) {
    var Msg = await DFiltersDB.findAll({
        where: {
            pattern: filter
        }
    });
    if (Msg.length === 0) {
        return false;
    } else {
        return await Msg[0].destroy();
    }
}

module.exports = {
    FiltersDB, getFilter, setFilter, deleteFilter,
    GFiltersDB, getGFilter, setGFilter, deleteGFilter,
    DFiltersDB, getDFilter, setDFilter, deleteDFilter
};

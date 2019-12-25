const guest = {
    "GET": {
        "/users/": ["*"],
        "/projects/": ["*"],
        "/activities/": ["*"],
        "/blogs/": ["*"]
    },
    "POST": {
        "/signup/": ["*"],
        "/login/": ["*"]
        //deny
    },
    "PUT": {
        //deny
    },
    "DELETE": {
        //deny
    }
}

const admin = {
    "GET": {
       ...guest.GET,
       "/admin/": ["*"],
    },
    "POST": {
        ...guest.POST,
        "/admin/": ["*"],
        "/user/" : ["*"],
        "/blogs/" : ["*"]
    },
    "PUT": {
        ...guest.PUT,
        "/admin/": ["*"],
        "/user/" : ["*"],
        "/blogs/" : ["*"]
    },
    "DELETE": {
        ...guest.DELETE,
        "/admin/": ["*"],
        "/user/" : ["*"],
        "/blogs/" : ["*"]
    }
}

module.exports.rights = {
    guest,
    admin
}
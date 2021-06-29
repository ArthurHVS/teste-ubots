function coolify(hot) {
    var coolCpf = hot.replace(/[\. -]+/g, '')
    return coolCpf
}
function sanitizeCPF(cpf) {
    var cool = coolify(cpf)
    if (cool.length > 11) {
        var final = cool.slice(-11)
        final = final.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4");
    }
    else {
        var final = cool.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4")
    }
    return final
}

module.exports = { sanitizeCPF, coolify };
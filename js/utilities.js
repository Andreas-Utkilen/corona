/* Inserts space into large numbers */
function numberToString(num) { // https://stackoverflow.com/questions/32012755/javascript-how-to-add-spaces-between-numbers/32013158#32013158
    if (!Number(num)) {
        return num;
    }

    return num.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
}
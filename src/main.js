// const Tests = document.querySelector('.res')
// Tests.innerHTML = 'test' изменение через константу
// document.querySelector('.res').innerHTML = "тридцать четыре" - изменение на прямую
// Находим кнопку, поле ввода и блок для истории
const btn = document.querySelector('#convert-btn')
const sumInput = document.querySelector('.sum')
const historyList = document.querySelector('.history_list')



btn.addEventListener('click', function () {
    const sum = sumInput.value
    if (sum === '') {
        return
    }
    const newRecord = document.createElement('div')
    newRecord.textContent = sum
    historyList.prepend(newRecord)
    sumInput.value = ''
    if (historyList.children.length > 10) {
        historyList.lastElementChild.remove();
    }
});




const divUpdate = document.querySelector('.update')
function updateTime() {
    const now = new Date()
    divUpdate.textContent = "Сегодня " + now.toLocaleString()
}
updateTime()

setInterval(updateTime, 1000)

sumInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        const btn = document.querySelector('#convert-btn');
        btn.click();
    }
});

fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    .then(response => response.json())
    .then(data => {
        const usd = data.Valute.USD.value
        const eur = data.Valute.EUR.value
        console.log('USD:', usd)
        console.log('EUR:', eur)
    })
    .catch(error => {
        console.error('Ошибка:',error)
    })
// Находим элементы
const btn = document.querySelector('#convert-btn');
const sumInput = document.querySelector('.sum');
const historyList = document.querySelector('.history_list');
const resultDiv = document.querySelector('.res');
const updateSpan = document.getElementById('last-updated');
const divUpdate = document.querySelector('.update');

// Переменная для курсов
let currencyRates = {};

// Загрузка курсов 
function loadRates() {
    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        .then(response => response.json())
        .then(data => {
            currencyRates = {
                RUB: 1,
                USD: data.Valute.USD.Value / data.Valute.USD.Nominal,
                EUR: data.Valute.EUR.Value / data.Valute.EUR.Nominal,
                KZT: data.Valute.KZT.Value / data.Valute.KZT.Nominal,
                UAH: data.Valute.UAH.Value / data.Valute.UAH.Nominal
            };
            updateSpan.textContent = new Date().toLocaleString();
            console.log('Курсы загружены:', currencyRates);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить курсы');
        });
}

// функция конвертации 
function convertCurrency() {
    const amount = parseFloat(sumInput.value);
    const fromCode = document.querySelectorAll('.currency-box select')[0].value;
    const toCode = document.querySelectorAll('.currency-box select')[1].value;
    const fromRate = currencyRates[fromCode];
    const toRate = currencyRates[toCode];
    const result = amount * (fromRate / toRate);

    // Выводим результат
    resultDiv.textContent = result.toFixed(2) + ' ' + toCode;
    const newRecord = document.createElement('div');
    newRecord.className = 'history-item';
    newRecord.textContent = `${amount} ${fromCode} → ${result.toFixed(2)} ${toCode}`;
    historyList.prepend(newRecord);
    if (historyList.children.length > 10) {
        historyList.lastElementChild.remove();
    }
    //история
    localStorage.setItem('history', JSON.stringify(historyList.innerHTML));
}

// ЗАГРУЗКА ИСТОРИИ
function loadHistory() {
    const savedHistory = localStorage.getItem('history');
    if (savedHistory) {
        historyList.innerHTML = JSON.parse(savedHistory);
    }
}

//загрузка
loadRates();
loadHistory();



// Часы
function updateTime() {
    divUpdate.textContent = "Сегодня " + new Date().toLocaleString();
}
updateTime();
setInterval(updateTime, 1000);

// вешаем конвертацию на кнопку
btn.addEventListener('click', convertCurrency);

// при нажатаии на enter кнопка срабатывает(для удобства)
sumInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        btn.click();
    }
});

// загружаем курсы при старте
loadRates();
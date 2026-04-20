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

            const ratesDate = new Date(data.Timestamp);
            updateSpan.innerHTML = `📅 Курс на дату: ${data.Date.split('T')[0]}<br>
                                    🕒 Официальный курс ЦБ РФ от: ${ratesDate.toLocaleString()}`

            console.log('Курсы загружены:', currencyRates)
        })
        .catch(error => {
            console.error('Ошибка:', error)
            alert('Не удалось загрузить курсы')
        });
}

// Функция конвертации 
function convertCurrency() {
    const amount = parseFloat(sumInput.value)
    const fromCode = document.querySelectorAll('.currency-box select')[0].value
    const toCode = document.querySelectorAll('.currency-box select')[1].value
    const fromRate = currencyRates[fromCode]
    const toRate = currencyRates[toCode]
    const result = amount * (fromRate / toRate)

    if (isNaN(amount) || amount === '') {
        resultDiv.textContent = 'Введите сумму'
        return;
    }

    // Выводим результат
    resultDiv.textContent = result.toFixed(2) + ' ' + toCode

    // Добавляем в историю
    const newRecord = document.createElement('div')
    newRecord.className = 'history-item'
    newRecord.textContent = `${amount} ${fromCode} → ${result.toFixed(2)} ${toCode}`
    historyList.prepend(newRecord)

    if (historyList.children.length > 10) {
        historyList.lastElementChild.remove()
    }

    // Сохраняем историю
    localStorage.setItem('history', JSON.stringify(historyList.innerHTML))//JSON.stringify нужен чтоб превратить обьект в строчку,потому что localstorage умеет работать только со строками
}

// Загрузка истории
function loadHistory() {
    const savedHistory = localStorage.getItem('history')
    if (savedHistory) {
        historyList.innerHTML = JSON.parse(savedHistory)//
    }
}

// Очистка истории
const clearBtn = document.querySelector('#clear-btn')
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        historyList.innerHTML = ''
        localStorage.clear('history')
        alert('История очищена!')
    });
}

// Вешаем конвертацию на кнопку
btn.addEventListener('click', convertCurrency)

// Enter на поле ввода
sumInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        btn.click()
    }
});

// Загружаем курсы и историю при старте
loadRates()
loadHistory()
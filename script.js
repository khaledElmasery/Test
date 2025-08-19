const translations = {
    ar: {
        app_title: "حاسبة استهلاك الطاقة الكهربائية",
        app_desc: "احسب استهلاك أجهزتك الكهربائية وتكلفتها الشهرية",
        add_device: "إضافة جهاز جديد",
        device_name: "اسم الجهاز:",
        device_power: "استهلاك الطاقة (وات):",
        daily_hours: "ساعات التشغيل اليومية:",
        weekly_days: "أيام التشغيل أسبوعياً:",
        add_device_btn: "إضافة جهاز",
        predefined_devices: "الأجهزة الشائعة",
        select_device: "اختر من القائمة:",
        devices_list: "الأجهزة المضافة",
        no_devices: "لم يتم إضافة أي أجهزة بعد",
        calculate_btn: "حساب الاستهلاك",
        reset_btn: "بدء من جديد",
        results_title: "نتائج حساب الاستهلاك",
        success_add: "تم إضافة الجهاز بنجاح",
        error_fields: "الرجاء ملء جميع الحقول",
        error_no_devices: "لم تقم بإضافة أي أجهزة بعد",
        success_calc: "تم حساب الاستهلاك بنجاح",
        success_reset: "تم بدء الحساب من جديد",
        monthly_consumption: "الاستهلاك الشهري",
        consumption_percentage: "نسبة الاستهلاك",
        total_consumption: "إجمالي الاستهلاك الشهري",
        monthly_cost: "التكلفة الشهرية التقريبية",
        highest_consumption: "أعلى جهاز استهلاكاً",
        lowest_consumption: "أقل جهاز استهلاكاً",
        remove: "إزالة"
    },
    en: {
        app_title: "Electricity Consumption Calculator",
        app_desc: "Calculate your electrical devices consumption and monthly cost",
        add_device: "Add New Device",
        device_name: "Device Name:",
        device_power: "Power Consumption (Watts):",
        daily_hours: "Daily Operating Hours:",
        weekly_days: "Weekly Operating Days:",
        add_device_btn: "Add Device",
        predefined_devices: "Common Devices",
        select_device: "Select from the list:",
        devices_list: "Added Devices",
        no_devices: "No devices added yet",
        calculate_btn: "Calculate Consumption",
        reset_btn: "Start Over",
        results_title: "Consumption Results",
        success_add: "Device added successfully",
        error_fields: "Please fill all fields",
        error_no_devices: "You haven't added any devices yet",
        success_calc: "Consumption calculated successfully",
        success_reset: "Calculation reset successfully",
        monthly_consumption: "Monthly Consumption",
        consumption_percentage: "Consumption Percentage",
        total_consumption: "Total Monthly Consumption",
        monthly_cost: "Approximate Monthly Cost",
        highest_consumption: "Highest Consumption Device",
        lowest_consumption: "Lowest Consumption Device",
        remove: "Remove"
    }
};

let devices = [];
let nextDeviceId = 1;
let currentLang = 'ar';

window.onload = function() {
    initApp();
};

function initApp() {
    setupEventListeners();
    setupPredefinedDevices();
    changeLanguage('ar');
}

function setupEventListeners() {
    document.getElementById('deviceForm').addEventListener('submit', handleAddDevice);
    document.getElementById('calculate-btn').addEventListener('click', calculateConsumption);
    document.getElementById('reset-btn').addEventListener('click', resetDevices);
    
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
}

function setupPredefinedDevices() {
    document.querySelectorAll('.device-card').forEach(function(card) {
        card.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const power = parseInt(this.getAttribute('data-power'));
            
            const device = {
                id: nextDeviceId++,
                name: name,
                power: power,
                dailyHours: 4,
                weeklyDays: 7
            };
            
            devices.push(device);
            updateDevicesList();
            showMessage(translate('success_add'), 'success');
        });
    });
}

function changeLanguage(lang) {
    currentLang = lang;
    
    document.querySelectorAll('[data-i18n]').forEach(function(element) {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[lang][key];
    });
    
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    
    document.querySelector('.lang-btn[data-lang="' + lang + '"]').classList.add('active');
    
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.lang = lang;
    
    if (devices.length > 0) {
        updateDevicesList();
    }
}

function translate(key) {
    return translations[currentLang][key];
}

function handleAddDevice(e) {
    e.preventDefault();
    
    const name = document.getElementById('deviceName').value;
    const power = parseInt(document.getElementById('devicePower').value);
    const hours = parseInt(document.getElementById('dailyHours').value);
    const days = parseInt(document.getElementById('weeklyDays').value);
    
    if (!name || !power || !hours || !days) {
        showMessage(translate('error_fields'), 'error');
        return;
    }
    
    const device = {
        id: nextDeviceId++,
        name: name,
        power: power,
        dailyHours: hours,
        weeklyDays: days
    };
    
    devices.push(device);
    updateDevicesList();
    showMessage(translate('success_add'), 'success');
    document.getElementById('deviceForm').reset();
}

function updateDevicesList() {
    const devicesList = document.getElementById('devicesList');
    const noDevicesMsg = document.getElementById('no-devices-msg');
    
    if (devices.length === 0) {
        noDevicesMsg.classList.remove('hidden');
        devicesList.querySelectorAll('.device-item').forEach(function(item) {
            item.remove();
        });
        return;
    }
    
    noDevicesMsg.classList.add('hidden');
    
    devicesList.querySelectorAll('.device-item').forEach(function(item) {
        item.remove();
    });
    
    devices.forEach(function(device) {
        const deviceItem = document.createElement('div');
        deviceItem.classList.add('device-item');
        
        const monthlyConsumption = calculateMonthlyConsumption(device);
        
        deviceItem.innerHTML = `
            <div class="device-info">
                <div class="device-name">${device.name}</div>
                <div class="device-details">
                    ${device.power} وات × ${device.dailyHours} ساعة/يوم × ${device.weeklyDays} يوم/أسبوع
                </div>
            </div>
            <div class="device-consumption">
                ${monthlyConsumption.toFixed(2)} ك.و.س
            </div>
            <button class="btn-danger remove-btn" data-id="${device.id}">
                🗑️ ${translate('remove')}
            </button>
        `;
        
        devicesList.appendChild(deviceItem);
    });
    
    document.querySelectorAll('.remove-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeDevice(id);
        });
    });
}

function removeDevice(id) {
    devices = devices.filter(function(device) {
        return device.id !== id;
    });
    updateDevicesList();
}

function calculateMonthlyConsumption(device) {
    const dailyConsumption = device.power * device.dailyHours / 1000;
    const weeklyConsumption = dailyConsumption * device.weeklyDays;
    const monthlyConsumption = weeklyConsumption * 4;
    
    return monthlyConsumption;
}

function calculateConsumption() {
    if (devices.length === 0) {
        showMessage(translate('error_no_devices'), 'error');
        return;
    }
    
    let totalMonthlyConsumption = 0;
    const deviceConsumptions = [];
    
    devices.forEach(function(device) {
        const monthlyConsumption = calculateMonthlyConsumption(device);
        totalMonthlyConsumption += monthlyConsumption;
        deviceConsumptions.push({
            device: device,
            consumption: monthlyConsumption
        });
    });
    
    const costPerKwh = 0.3;
    const monthlyCost = totalMonthlyConsumption * costPerKwh;
    
    const sortedDevices = deviceConsumptions.sort(function(a, b) {
        return b.consumption - a.consumption;
    });
    
    const highestDevice = sortedDevices[0];
    const lowestDevice = sortedDevices[sortedDevices.length - 1];
    
    let resultsHTML = `
        <div class="result-item">
            <div class="result-title">${translate('total_consumption')}</div>
            <div class="consumption-bar">${totalMonthlyConsumption.toFixed(2)} كيلوواط/ساعة</div>
        </div>
        
        <div class="result-item">
            <div class="result-title">${translate('monthly_cost')}</div>
            <div class="consumption-bar">${monthlyCost.toFixed(2)} $</div>
        </div>
        
        <div class="result-item">
            <div class="result-title">${translate('highest_consumption')}</div>
            <div>${highestDevice.device.name}: ${highestDevice.consumption.toFixed(2)} كيلوواط/ساعة</div>
        </div>
        
        <div class="result-item">
            <div class="result-title">${translate('lowest_consumption')}</div>
            <div>${lowestDevice.device.name}: ${lowestDevice.consumption.toFixed(2)} كيلوواط/ساعة</div>
        </div>
    `;
    
    document.getElementById('resultsDetails').innerHTML = resultsHTML;
    document.getElementById('consumptionResults').classList.remove('hidden');
    
    showMessage(translate('success_calc'), 'success');
}

function resetDevices() {
    devices = [];
    nextDeviceId = 1;
    updateDevicesList();
    document.getElementById('consumptionResults').classList.add('hidden');
    showMessage(translate('success_reset'), 'success');
}

function showMessage(message, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = 'message ' + type;
    messageEl.classList.remove('hidden');
    
    setTimeout(function() {
        messageEl.classList.add('hidden');
    }, 3000);
}

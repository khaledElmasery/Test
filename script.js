const EnergyCalculator = {
    devices: [],
    nextDeviceId: 1,
    currentLang: 'ar',
    
    translations: {
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
    },

    init: function() {
        this.setupEventListeners();
        this.setupPredefinedDevices();
        this.changeLanguage('ar');
    },

    setupEventListeners: function() {
        document.getElementById('deviceForm').addEventListener('submit', (e) => this.handleAddDevice(e));
        document.getElementById('calculate-btn').addEventListener('click', () => this.calculateConsumption());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetDevices());
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });
    },

    setupPredefinedDevices: function() {
        document.querySelectorAll('.device-card').forEach(card => {
            card.addEventListener('click', () => {
                const name = card.getAttribute('data-name');
                const power = parseInt(card.getAttribute('data-power'));
                
                const device = {
                    id: this.nextDeviceId++,
                    name: name,
                    power: power,
                    dailyHours: 4,
                    weeklyDays: 7
                };
                
                this.devices.push(device);
                this.updateDevicesList();
                this.showMessage(this.translate('success_add'), 'success');
            });
        });
    },

    changeLanguage: function(lang) {
        this.currentLang = lang;
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translations[lang][key];
        });
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add('active');
        
        document.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.lang = lang;
        
        if (this.devices.length > 0) {
            this.updateDevicesList();
        }
    },

    translate: function(key) {
        return this.translations[this.currentLang][key];
    },

    handleAddDevice: function(e) {
        e.preventDefault();
        
        const name = document.getElementById('deviceName').value;
        const power = parseInt(document.getElementById('devicePower').value);
        const hours = parseInt(document.getElementById('dailyHours').value);
        const days = parseInt(document.getElementById('weeklyDays').value);
        
        if (!name || !power || !hours || !days) {
            this.showMessage(this.translate('error_fields'), 'error');
            return;
        }
        
        const device = {
            id: this.nextDeviceId++,
            name: name,
            power: power,
            dailyHours: hours,
            weeklyDays: days
        };
        
        this.devices.push(device);
        this.updateDevicesList();
        this.showMessage(this.translate('success_add'), 'success');
        document.getElementById('deviceForm').reset();
    },

    updateDevicesList: function() {
        const devicesList = document.getElementById('devicesList');
        const noDevicesMsg = document.getElementById('no-devices-msg');
        
        if (this.devices.length === 0) {
            noDevicesMsg.classList.remove('hidden');
            devicesList.querySelectorAll('.device-item').forEach(item => item.remove());
            return;
        }
        
        noDevicesMsg.classList.add('hidden');
        
        devicesList.querySelectorAll('.device-item').forEach(item => item.remove());
        
        this.devices.forEach(device => {
            const deviceItem = document.createElement('div');
            deviceItem.classList.add('device-item');
            
            const monthlyConsumption = this.calculateMonthlyConsumption(device);
            
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
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            devicesList.appendChild(deviceItem);
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                this.removeDevice(id);
            });
        });
    },

    removeDevice: function(id) {
        this.devices = this.devices.filter(device => device.id !== id);
        this.updateDevicesList();
    },

    calculateMonthlyConsumption: function(device) {
        const dailyConsumption = device.power * device.dailyHours / 1000;
        const weeklyConsumption = dailyConsumption * device.weeklyDays;
        const monthlyConsumption = weeklyConsumption * 4;
        
        return monthlyConsumption;
    },

    calculateConsumption: function() {
        if (this.devices.length === 0) {
            this.showMessage(this.translate('error_no_devices'), 'error');
            return;
        }
        
        let totalMonthlyConsumption = 0;
        const deviceConsumptions = [];
        
        this.devices.forEach(device => {
            const monthlyConsumption = this.calculateMonthlyConsumption(device);
            totalMonthlyConsumption += monthlyConsumption;
            deviceConsumptions.push({
                device: device,
                consumption: monthlyConsumption
            });
        });
        
        const costPerKwh = 0.3;
        const monthlyCost = totalMonthlyConsumption * costPerKwh;
        
        const sortedDevices = [...deviceConsumptions].sort((a, b) => b.consumption - a.consumption);
        const highestDevice = sortedDevices[0];
        const lowestDevice = sortedDevices[sortedDevices.length - 1];
        
        this.displayResults(totalMonthlyConsumption, monthlyCost, deviceConsumptions, highestDevice, lowestDevice);
        
        this.showMessage(this.translate('success_calc'), 'success');
    },

    displayResults: function(totalConsumption, monthlyCost, deviceConsumptions, highestDevice, lowestDevice) {
        const resultsContainer = document.getElementById('resultsDetails');
        resultsContainer.innerHTML = '';
        
        deviceConsumptions.forEach(item => {
            const percentage = (item.consumption / totalConsumption) * 100;
            
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            
            resultItem.innerHTML = `
                <div class="result-title">${item.device.name}</div>
                <div>${item.consumption.toFixed(2)} ك.و.س (${percentage.toFixed(1)}%)</div>
                <div class="consumption-bar" style="width: ${percentage}%">${percentage.toFixed(1)}%</div>
            `;
            
            resultsContainer.appendChild(resultItem);
        });
        
        const totalItem = document.createElement('div');
        totalItem.classList.add('result-item');
        totalItem.innerHTML = `
            <div class="result-title">${this.translate('total_consumption')}</div>
            <div>${totalConsumption.toFixed(2)} ك.و.س</div>
            <div class="result-title">${this.translate('monthly_cost')}</div>
            <div>$${monthlyCost.toFixed(2)}</div>
        `;
        
        resultsContainer.appendChild(totalItem);
        
        const extremesItem = document.createElement('div');
        extremesItem.classList.add('result-item');
        
        extremesItem.innerHTML = `
            <div class="result-title">${this.translate('highest_consumption')}</div>
            <div>${highestDevice.device.name} - ${highestDevice.consumption.toFixed(2)} ك.و.س</div>
            <div class="result-title">${this.translate('lowest_consumption')}</div>
            <div>${lowestDevice.device.name} - ${lowestDevice.consumption.toFixed(2)} ك.و.س</div>
        `;
        
        resultsContainer.appendChild(extremesItem);
        
        document.getElementById('consumptionResults').classList.remove('hidden');
    },

    resetDevices: function() {
        this.devices = [];
        this.nextDeviceId = 1;
        this.updateDevicesList();
        document.getElementById('consumptionResults').classList.add('hidden');
        this.showMessage(this.translate('success_reset'), 'success');
    },

    showMessage: function(message, type) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.classList.remove('hidden');
        
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    EnergyCalculator.init();
});
const  report = require("multiple-cucumber-html-reporter");

report.generate({
    jsonDir: "reports/json/",
    reportPath: "./reports/html/multiple-html-report/",
    displayReportTime: true,
    openReportInBrowser: false,
    displayDuration: true,
    metadata: {
        browser: {
            name: "Placeholder",
            version: "Placeholder",
        },
        device: "Placeholder",
        platform: {
            name: "Placeholder",
        },
    },
        reportName: "Cypress suite run",
        customData: {
            title: "Run info",
            data: [
                {label: "Project", value: "Cypress daily run"},
                {label: "Environment", value: "Local"},
                {label: 'Execution Date', value: new Date().toUTCString()},
            ],
    },
})
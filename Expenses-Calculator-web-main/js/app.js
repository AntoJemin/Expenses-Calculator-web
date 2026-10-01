/* ============================================================
   EXPENSE MANAGER - LOCAL STORAGE
   ============================================================

   Supports:

   Income
   Expense
   Income Categories
   Expense Categories
   Expense Sub-Categories
   Amount Types / Accounts
   Payment Methods
   Sources
   Account Balances
   Charts
   Excel Export

   Existing localStorage transactions are preserved.
============================================================ */


/* ============================================================
   STORAGE KEYS
============================================================ */

const STORAGE_KEY =
    'expenseManagerTransactions_v1';

const CATEGORY_KEY =
    'expenseManagerCategories_v1';

const INCOME_CATEGORY_KEY =
    'expenseManagerIncomeCategories_v1';

const SUBCATEGORY_KEY =
    'expenseManagerSubCategories_v1';

const ACCOUNT_KEY =
    'expenseManagerAccounts_v1';

const PAYMENT_KEY =
    'expenseManagerPaymentMethods_v1';

const SOURCE_KEY =
    'expenseManagerSources_v1';


/* ============================================================
   DEFAULT EXPENSE CATEGORIES
============================================================ */

const defaultExpenseCategories = [

    'Housing',
    'Food',
    'Transportation',
    'Personal',
    'Health',
    'Education',
    'Financial',
    'Family',
    'Travel',
    'Donations',
    'Miscellaneous',
    'Other'

];


/* ============================================================
   DEFAULT INCOME CATEGORIES
============================================================ */

const defaultIncomeCategories = [

    'Salary',
    'Rent Received',
    'Personal',
    'Money Back',
    'Business Income',
    'Freelance',
    'Bonus',
    'Interest',
    'Dividend',
    'Refund',
    'Gift',
    'Other Income'

];


/* ============================================================
   DEFAULT PAYMENT METHODS
============================================================ */

const defaultPaymentMethods = [

    'UPI',
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Net Banking',
    'Wallet',
    'Other'

];


/* ============================================================
   DEFAULT SOURCES
============================================================ */

const defaultSources = [

    'Paytm',
    'GPay',
    'PhonePe',
    'Account Transfer',
    'UPI',
    'Cash',
    'Bank',
    'Other'

];


/* ============================================================
   DEFAULT SUB-CATEGORIES
============================================================ */

const defaultSubCategories = {

    Housing: [

        'Rent',
        'House Maintenance',
        'Electricity',
        'Water Bill',
        'Gas',
        'Internet / Broadband',
        'Home Repairs',
        'Furniture',
        'Home Appliances',
        'Property Tax',
        'Security / Maintenance'

    ],


    Food: [

        'Groceries',
        'Vegetables & Fruits',
        'Restaurant',
        'Food Delivery',
        'Snacks',
        'Beverages',
        'Bakery',
        'Office Food',
        'Other Food'

    ],


    Transportation: [

        'Petrol',
        'Diesel',
        'EV Charging',
        'Bus',
        'Metro',
        'Train',
        'Taxi / Cab',
        'Auto',
        'Bike Maintenance',
        'Car Maintenance',
        'Parking',
        'Toll',
        'Vehicle Insurance'

    ],


    Personal: [

        'Clothing',
        'Shoes',
        'Salon / Haircut',
        'Skincare',
        'Cosmetics',
        'Personal Accessories',
        'Mobile Recharge',
        'Entertainment',
        'Hobbies',
        'Gym / Fitness',
        'Personal Shopping'

    ],


    Health: [

        'Doctor',
        'Hospital',
        'Pharmacy / Medicines',
        'Medical Tests',
        'Dental',
        'Eye Care',
        'Health Insurance',
        'Emergency Medical',
        'Other Medical'

    ],


    Education: [

        'College / University',
        'Course / Training',
        'Certification',
        'Books',
        'Stationery',
        'Exam Fees',
        'Online Courses',
        'Software / Learning Tools'

    ],


    Financial: [

        'Loan EMI',
        'Credit Card Payment',
        'Bank Charges',
        'ATM Charges',
        'Interest',
        'Insurance',
        'Investment',
        'Mutual Fund / SIP',
        'Stocks',
        'Gold',
        'FD / RD',
        'Tax',
        'Other Financial'

    ],


    Family: [

        'Parents',
        'Spouse',
        'Children',
        'Family Shopping',
        'Family Medical',
        'Family Travel',
        'Family Functions',
        'Household Support',
        'Other Family'

    ],


    Travel: [

        'Flight',
        'Train',
        'Bus',
        'Hotel',
        'Accommodation',
        'Travel Food',
        'Local Transport',
        'Travel Shopping',
        'Travel Activities',
        'Travel Insurance',
        'Visa / Passport'

    ],


    Donations: [

        'Charity',
        'Temple / Church / Mosque',
        'NGO',
        'Religious Donation',
        'Community Donation',
        'Other Donation'

    ],


    Miscellaneous: [

        'Gifts',
        'Events',
        'Fines / Penalties',
        'Courier',
        'Professional Services',
        'Repairs',
        'Office Expenses',
        'Unexpected Expenses',
        'Other'

    ],


    Other: [

        'Unclassified',
        'Unknown',
        'Other Expense'

    ]

};


/* ============================================================
   DEFAULT ACCOUNTS
============================================================ */

const defaultAccounts = [

    {
        id: 'default_hdfc',
        name: 'HDFC Account',
        type: 'Bank',
        openingBalance: 0,
        description: 'HDFC Bank Account'
    },

    {
        id: 'default_sbi',
        name: 'SBI Account',
        type: 'Bank',
        openingBalance: 0,
        description: 'SBI Bank Account'
    },

    {
        id: 'default_cash',
        name: 'Cash',
        type: 'Cash',
        openingBalance: 0,
        description: 'Physical Cash'
    }

];


/* ============================================================
   LOAD DATA
============================================================ */

let transactions =
    load(
        STORAGE_KEY,
        []
    );


let expenseCategories =
    load(
        CATEGORY_KEY,
        defaultExpenseCategories
    );


let incomeCategories =
    load(
        INCOME_CATEGORY_KEY,
        defaultIncomeCategories
    );


let subCategories =
    load(
        SUBCATEGORY_KEY,
        defaultSubCategories
    );


let accounts =
    load(
        ACCOUNT_KEY,
        []
    );


let paymentMethods =
    load(
        PAYMENT_KEY,
        defaultPaymentMethods
    );


let sources =
    load(
        SOURCE_KEY,
        defaultSources
    );


let monthlyChart;

let categoryChart;

// Food split popup and chart-filter state.
let pendingFoodTransaction = null;
let pendingFoodEditId = '';
let foodSplitModalInstance = null;
let foodSplitSaveInProgress = false;
let foodSplitFilterActive = false;
let foodSplitSelection = { myself: true, others: true };


/* ============================================================
   HELPERS
============================================================ */

function load(
    key,
    fallback
) {

    try {

        const value =
            JSON.parse(
                localStorage.getItem(key)
            );

        return value ?? fallback;

    } catch {

        return fallback;

    }

}


function save() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
    );


    localStorage.setItem(
        CATEGORY_KEY,
        JSON.stringify(expenseCategories)
    );


    localStorage.setItem(
        INCOME_CATEGORY_KEY,
        JSON.stringify(incomeCategories)
    );


    localStorage.setItem(
        SUBCATEGORY_KEY,
        JSON.stringify(subCategories)
    );


    localStorage.setItem(
        ACCOUNT_KEY,
        JSON.stringify(accounts)
    );


    localStorage.setItem(
        PAYMENT_KEY,
        JSON.stringify(paymentMethods)
    );


    localStorage.setItem(
        SOURCE_KEY,
        JSON.stringify(sources)
    );

}


function id() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );

}


function money(value) {

    return new Intl.NumberFormat(
        'en-IN',
        {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }
    ).format(
        Number(value) || 0
    );

}


function today() {

    return new Date()
        .toISOString()
        .slice(0, 10);

}


function esc(value) {

    return String(
        value ?? ''
    ).replace(
        /[&<>'"]/g,
        character => ({

            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'

        }[character])
    );

}


/* ============================================================
   INITIALIZE ACCOUNTS
============================================================ */

function initializeAccounts() {

    if (
        !Array.isArray(accounts)
    ) {

        accounts = [];

    }


    /*
       IMPORTANT:
       If existing accounts already exist,
       do not overwrite them.
    */

    if (
        accounts.length === 0
    ) {

        accounts =
            defaultAccounts.map(
                account => ({

                    ...account,

                    id: id()

                })
            );


        save();

    }

}


/* ============================================================
   INITIALIZE SUB-CATEGORIES
============================================================ */

function initializeSubCategories() {

    if (
        !subCategories ||
        typeof subCategories !== 'object' ||
        Array.isArray(subCategories)
    ) {

        subCategories = {};

    }


    Object.keys(
        defaultSubCategories
    ).forEach(
        category => {

            if (
                !Array.isArray(
                    subCategories[category]
                )
            ) {

                subCategories[category] =
                    [
                        ...defaultSubCategories[
                            category
                        ]
                    ];

            }

        }
    );


    save();

}


/* ============================================================
   ACCOUNT FUNCTIONS
============================================================ */

function getAccount(
    accountId
) {

    return accounts.find(
        account =>
            account.id === accountId
    );

}


function getAccountName(
    accountId
) {

    const account =
        getAccount(
            accountId
        );


    return account
        ? account.name
        : '-';

}


function getAccountBalance(
    accountId
) {

    const account =
        getAccount(
            accountId
        );


    if (!account) {

        return 0;

    }


    const income =
        transactions
            .filter(
                transaction =>
                    transaction.accountId ===
                        accountId &&
                    transaction.type ===
                        'Income'
            )
            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    Number(
                        transaction.amount
                    ),

                0
            );


    const expenses =
        transactions
            .filter(
                transaction =>
                    transaction.accountId ===
                        accountId &&
                    transaction.type ===
                        'Expense'
            )
            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    Number(
                        transaction.amount
                    ),

                0
            );


    return (
        Number(
            account.openingBalance || 0
        ) +
        income -
        expenses
    );

}


/* ============================================================
   ACCOUNT DROPDOWN
============================================================ */

function populateAccountDropdown() {

    const select =
        document.querySelector(
            '#transactionAccount'
        );


    if (!select) {

        return;

    }


    const oldValue =
        select.value;


    select.innerHTML = `

        <option value="">
            Select Account
        </option>

    `;


    accounts.forEach(
        account => {

            const option =
                document.createElement(
                    'option'
                );


            option.value =
                account.id;


            option.textContent =
                `${account.name} (${money(
                    getAccountBalance(
                        account.id
                    )
                )})`;


            select.appendChild(
                option
            );

        }
    );


    if (
        oldValue &&
        accounts.some(
            account =>
                account.id === oldValue
        )
    ) {

        select.value =
            oldValue;

    }

}


/* ============================================================
   ACCOUNT FILTER
============================================================ */

function populateAccountFilter() {

    const select =
        document.querySelector(
            '#accountFilter'
        );


    if (!select) {

        return;

    }


    const oldValue =
        select.value;


    select.innerHTML = `

        <option value="all">
            All Accounts
        </option>

    `;


    accounts.forEach(
        account => {

            const option =
                document.createElement(
                    'option'
                );


            option.value =
                account.id;


            option.textContent =
                account.name;


            select.appendChild(
                option
            );

        }
    );


    if (
        oldValue &&
        (
            oldValue === 'all' ||
            accounts.some(
                account =>
                    account.id === oldValue
            )
        )
    ) {

        select.value =
            oldValue;

    }

}


/* ============================================================
   RENDER ACCOUNTS
============================================================ */

function renderAccounts() {

    const container =
        document.querySelector(
            '#accountsContainer'
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        accounts
            .map(
                account => {

                    const balance =
                        getAccountBalance(
                            account.id
                        );


                    const balanceClass =
                        balance >= 0
                            ? 'text-success'
                            : 'text-danger';


                    return `

                        <div
                            class="col-md-6 col-xl-4">

                            <div
                                class="card account-card h-100">

                                <div
                                    class="card-body">

                                    <div
                                        class="d-flex
                                               justify-content-between
                                               align-items-start">

                                        <div>

                                            <h5
                                                class="card-title">

                                                ${esc(
                                                    account.name
                                                )}

                                            </h5>


                                            <span
                                                class="badge text-bg-light">

                                                ${esc(
                                                    account.type
                                                )}

                                            </span>

                                        </div>


                                        <div
                                            class="dropdown">

                                            <button
                                                class="btn
                                                       btn-sm
                                                       btn-outline-secondary"
                                                data-bs-toggle="dropdown">

                                                ⋮

                                            </button>


                                            <ul
                                                class="dropdown-menu
                                                       dropdown-menu-end">

                                                <li>

                                                    <button
                                                        class="dropdown-item"
                                                        onclick="editAccount('${account.id}')">

                                                        Edit

                                                    </button>

                                                </li>


                                                <li>

                                                    <button
                                                        class="dropdown-item text-danger"
                                                        onclick="deleteAccount('${account.id}')">

                                                        Delete

                                                    </button>

                                                </li>

                                            </ul>

                                        </div>

                                    </div>


                                    <div class="mt-4">

                                        <small
                                            class="text-muted">

                                            Current Balance

                                        </small>


                                        <h3
                                            class="${balanceClass}">

                                            ${money(
                                                balance
                                            )}

                                        </h3>

                                    </div>


                                    <small
                                        class="text-muted">

                                        Opening Balance:
                                        ${money(
                                            account.openingBalance
                                        )}

                                    </small>

                                </div>

                            </div>

                        </div>

                    `;

                }
            )
            .join('');

}


/* ============================================================
   ACCOUNT FORM
============================================================ */

window.prepareAccountForm =
function () {

    document
        .querySelector(
            '#accountForm'
        )
        .reset();


    document.querySelector(
        '#accountEditId'
    ).value = '';


    document.querySelector(
        '#accountFormTitle'
    ).textContent =
        'Add Account';


    document.querySelector(
        '#openingBalance'
    ).value =
        '0';

};


window.editAccount =
function (accountId) {

    const account =
        getAccount(
            accountId
        );


    if (!account) {

        return;

    }


    document.querySelector(
        '#accountEditId'
    ).value =
        account.id;


    document.querySelector(
        '#accountFormTitle'
    ).textContent =
        'Edit Account';


    document.querySelector(
        '#accountName'
    ).value =
        account.name;


    document.querySelector(
        '#accountType'
    ).value =
        account.type;


    document.querySelector(
        '#openingBalance'
    ).value =
        account.openingBalance;


    document.querySelector(
        '#accountDescription'
    ).value =
        account.description || '';


    new bootstrap.Modal(
        document.querySelector(
            '#accountModal'
        )
    ).show();

};


window.deleteAccount =
function (accountId) {

    const account =
        getAccount(
            accountId
        );


    if (!account) {

        return;

    }


    const used =
        transactions.some(
            transaction =>
                transaction.accountId ===
                accountId
        );


    if (used) {

        alert(
            'This account is used by existing transactions. ' +
            'Please edit or remove those transactions first.'
        );

        return;

    }


    if (
        !confirm(
            `Delete "${account.name}"?`
        )
    ) {

        return;

    }


    accounts =
        accounts.filter(
            account =>
                account.id !== accountId
        );


    save();

    populateAccountDropdown();

    populateAccountFilter();

    renderAccounts();

};


document
    .querySelector(
        '#accountForm'
    )
    ?.addEventListener(
        'submit',
        event => {

            event.preventDefault();


            const editId =
                document.querySelector(
                    '#accountEditId'
                ).value;


            const name =
                document.querySelector(
                    '#accountName'
                ).value.trim();


            const type =
                document.querySelector(
                    '#accountType'
                ).value;


            const openingBalance =
                Number(
                    document.querySelector(
                        '#openingBalance'
                    ).value
                );


            const description =
                document.querySelector(
                    '#accountDescription'
                ).value.trim();


            if (!name) {

                alert(
                    'Please enter an account name.'
                );

                return;

            }


            if (
                openingBalance < 0 ||
                Number.isNaN(
                    openingBalance
                )
            ) {

                alert(
                    'Opening balance cannot be negative.'
                );

                return;

            }


            const duplicate =
                accounts.some(
                    account =>
                        account.name
                            .toLowerCase() ===
                        name.toLowerCase() &&
                        account.id !== editId
                );


            if (duplicate) {

                alert(
                    'An account with this name already exists.'
                );

                return;

            }


            if (editId) {

                accounts =
                    accounts.map(
                        account =>

                            account.id === editId

                                ? {

                                    ...account,

                                    name,
                                    type,
                                    openingBalance,
                                    description

                                }

                                : account
                    );

            } else {

                accounts.push({

                    id: id(),

                    name,

                    type,

                    openingBalance,

                    description

                });

            }


            save();

            populateAccountDropdown();

            populateAccountFilter();

            renderAccounts();


            const modal =
                bootstrap.Modal.getInstance(
                    document.querySelector(
                        '#accountModal'
                    )
                );


            modal?.hide();

        }
    );


/* ============================================================
   PAYMENT METHODS
============================================================ */

function populatePaymentMethods() {

    const select =
        document.querySelector(
            '#payment'
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Select Payment Method
        </option>

        ${
            paymentMethods
                .map(
                    method =>
                        `<option value="${esc(method)}">
                            ${esc(method)}
                        </option>`
                )
                .join('')
        }

    `;

}


/* ============================================================
   SOURCES
============================================================ */

function populateSources() {

    const select =
        document.querySelector(
            '#source'
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Select Source
        </option>

        ${
            sources
                .map(
                    source =>
                        `<option value="${esc(source)}">
                            ${esc(source)}
                        </option>`
                )
                .join('')
        }

        <option value="__new">
            + Add New Source
        </option>

    `;

}


window.addCustomSource =
function () {

    const source =
        prompt(
            'Enter new source:'
        );


    if (
        !source ||
        !source.trim()
    ) {

        return;

    }


    const value =
        source.trim();


    const exists =
        sources.some(
            item =>
                item.toLowerCase() ===
                value.toLowerCase()
        );


    if (!exists) {

        sources.push(
            value
        );

        save();

    }


    populateSources();


    document.querySelector(
        '#source'
    ).value =
        value;

};


/* ============================================================
   INCOME CATEGORY
============================================================ */

function populateIncomeCategories() {

    const select =
        document.querySelector(
            '#incomeCategory'
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Select Income Category
        </option>

        ${
            incomeCategories
                .map(
                    category =>
                        `<option value="${esc(category)}">
                            ${esc(category)}
                        </option>`
                )
                .join('')
        }

    `;

}


/* ============================================================
   EXPENSE CATEGORY
============================================================ */

function populateExpenseCategories() {

    const select =
        document.querySelector(
            '#category'
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Select Expense Category
        </option>

        ${
            expenseCategories
                .map(
                    category =>
                        `<option value="${esc(category)}">
                            ${esc(category)}
                        </option>`
                )
                .join('')
        }

    `;

}


/* ============================================================
   FILTER CATEGORY
============================================================ */

function populateCategoryFilter() {

    const filter =
        document.querySelector(
            '#categoryFilter'
        );


    if (!filter) {

        return;

    }


    const oldValue =
        filter.value;


    filter.innerHTML = `

        <option value="all">
            All Categories
        </option>

    `;


    const allCategories = [
        ...new Set(
            [
                ...expenseCategories,
                ...incomeCategories
            ]
        )
    ];


    allCategories.forEach(
        category => {

            const option =
                document.createElement(
                    'option'
                );


            option.value =
                category;


            option.textContent =
                category;


            filter.appendChild(
                option
            );

        }
    );


    if (
        allCategories.includes(
            oldValue
        )
    ) {

        filter.value =
            oldValue;

    }

}


/* ============================================================
   SUB CATEGORY
============================================================ */

function populateSubCategories(
    selectedCategory = null,
    selectedValue = ''
) {

    const select =
        document.querySelector(
            '#subCategory'
        );


    if (!select) {

        return;

    }


    const category =
        selectedCategory ??
        document.querySelector(
            '#category'
        ).value;


    const values =
        subCategories[
            category
        ] || [];


    select.innerHTML = `

        <option value="">
            Select Sub-Category
        </option>

        ${
            values
                .map(
                    value =>
                        `<option value="${esc(value)}">
                            ${esc(value)}
                        </option>`
                )
                .join('')
        }

        <option value="__new">
            + Add New Sub-Category
        </option>

    `;


    if (
        selectedValue &&
        values.includes(
            selectedValue
        )
    ) {

        select.value =
            selectedValue;

    }

}


/* ============================================================
   CATEGORY CHANGE
============================================================ */

document
    .querySelector(
        '#category'
    )
    ?.addEventListener(
        'change',
        event => {

            if (
                event.target.value ===
                '__new'
            ) {

                addNewExpenseCategory();

                return;

            }


            populateSubCategories(
                event.target.value
            );

        }
    );


/* ============================================================
   ADD EXPENSE CATEGORY
============================================================ */

function addNewExpenseCategory() {

    const name =
        prompt(
            'Enter new Expense Category:'
        );


    if (
        !name ||
        !name.trim()
    ) {

        populateExpenseCategories();

        return;

    }


    const value =
        name.trim();


    const exists =
        expenseCategories.some(
            category =>
                category.toLowerCase() ===
                value.toLowerCase()
        );


    if (exists) {

        alert(
            'This Expense Category already exists.'
        );

        populateExpenseCategories();

        document.querySelector(
            '#category'
        ).value =
            value;

        populateSubCategories(
            value
        );

        return;

    }


    expenseCategories.push(
        value
    );


    if (
        !subCategories[value]
    ) {

        subCategories[value] =
            [];

    }


    save();


    populateExpenseCategories();

    populateCategoryFilter();


    document.querySelector(
        '#category'
    ).value =
        value;


    populateSubCategories(
        value
    );

}


/* ============================================================
   CATEGORY MANAGER
============================================================ */

let categoryManagerType =
    'Expense';


window.openCategoryManager =
function (type) {

    categoryManagerType =
        type;


    document.querySelector(
        '#categoryManagerType'
    ).textContent =
        type === 'Income'
            ? 'Income Categories'
            : 'Expense Categories';


    renderCategoryManager();


    new bootstrap.Modal(
        document.querySelector(
            '#categoryManagerModal'
        )
    ).show();

};


function renderCategoryManager() {

    const container =
        document.querySelector(
            '#categoryManagerList'
        );


    if (!container) {

        return;

    }


    const list =
        categoryManagerType ===
            'Income'
            ? incomeCategories
            : expenseCategories;


    container.innerHTML =
        list
            .map(
                category => `

                    <div
                        class="list-group-item
                               d-flex
                               justify-content-between
                               align-items-center">

                        <span>
                            ${esc(category)}
                        </span>


                        <div>

                            <button
                                class="btn btn-sm btn-outline-primary me-1"
                                onclick="editCategory('${esc(category)}')">

                                Edit

                            </button>


                            <button
                                class="btn btn-sm btn-outline-danger"
                                onclick="deleteCategory('${esc(category)}')">

                                Delete

                            </button>

                        </div>

                    </div>

                `
            )
            .join('');

}


window.addCategoryFromManager =
function () {

    const name =
        prompt(
            `Enter new ${
                categoryManagerType
            } Category:`
        );


    if (
        !name ||
        !name.trim()
    ) {

        return;

    }


    const value =
        name.trim();


    const list =
        categoryManagerType ===
            'Income'
            ? incomeCategories
            : expenseCategories;


    if (
        list.some(
            item =>
                item.toLowerCase() ===
                value.toLowerCase()
        )
    ) {

        alert(
            'This category already exists.'
        );

        return;

    }


    list.push(
        value
    );


    if (
        categoryManagerType ===
        'Expense'
    ) {

        if (
            !subCategories[value]
        ) {

            subCategories[value] =
                [];

        }

    }


    save();

    populateIncomeCategories();

    populateExpenseCategories();

    populateCategoryFilter();

    renderCategoryManager();

};


window.editCategory =
function (oldName) {

    const newName =
        prompt(
            'Enter new category name:',
            oldName
        );


    if (
        !newName ||
        !newName.trim() ||
        newName.trim() === oldName
    ) {

        return;

    }


    const value =
        newName.trim();


    const list =
        categoryManagerType ===
            'Income'
            ? incomeCategories
            : expenseCategories;


    if (
        list.some(
            item =>
                item.toLowerCase() ===
                value.toLowerCase()
        )
    ) {

        alert(
            'A category with this name already exists.'
        );

        return;

    }


    const index =
        list.indexOf(
            oldName
        );


    if (
        index === -1
    ) {

        return;

    }


    list[index] =
        value;


    /*
       Expense category rename:

       Also rename its sub-category parent.
    */

    if (
        categoryManagerType ===
        'Expense'
    ) {

        if (
            subCategories[
                oldName
            ]
        ) {

            subCategories[
                value
            ] =
                subCategories[
                    oldName
                ];

            delete subCategories[
                oldName
            ];

        }


        /*
           Preserve existing transactions.
           Update only category name.
        */

        transactions =
            transactions.map(
                transaction =>

                    transaction.category ===
                    oldName

                        ? {
                            ...transaction,
                            category: value
                        }

                        : transaction
            );

    }


    /*
       Income category rename
    */

    if (
        categoryManagerType ===
        'Income'
    ) {

        transactions =
            transactions.map(
                transaction =>

                    transaction.incomeCategory ===
                    oldName

                        ? {
                            ...transaction,
                            incomeCategory: value
                        }

                        : transaction
            );

    }


    save();


    populateIncomeCategories();

    populateExpenseCategories();

    populateCategoryFilter();

    populateSubCategories();


    renderCategoryManager();

    render();

};


window.deleteCategory =
function (categoryName) {

    const list =
        categoryManagerType ===
            'Income'
            ? incomeCategories
            : expenseCategories;


    const used =
        transactions.some(
            transaction => {

                if (
                    categoryManagerType ===
                    'Income'
                ) {

                    return (
                        transaction.incomeCategory ===
                        categoryName
                    );

                }


                return (
                    transaction.category ===
                    categoryName
                );

            }
        );


    if (used) {

        alert(
            'This category is used by existing transactions. ' +
            'Please edit those transactions first.'
        );

        return;

    }


    if (
        !confirm(
            `Delete category "${categoryName}"?`
        )
    ) {

        return;

    }


    if (
        categoryManagerType ===
        'Expense'
    ) {

        expenseCategories =
            expenseCategories.filter(
                category =>
                    category !==
                    categoryName
            );


        delete subCategories[
            categoryName
        ];

    } else {

        incomeCategories =
            incomeCategories.filter(
                category =>
                    category !==
                    categoryName
            );

    }


    save();


    populateIncomeCategories();

    populateExpenseCategories();

    populateCategoryFilter();

    populateSubCategories();

    renderCategoryManager();

};


/* ============================================================
   SUB CATEGORY MANAGER
============================================================ */

window.openSubCategoryManager =
function () {

    const category =
        document.querySelector(
            '#category'
        ).value;


    if (
        !category
    ) {

        alert(
            'Please select an Expense Category first.'
        );

        return;

    }


    document.querySelector(
        '#subCategoryManagerTitle'
    ).textContent =
        `${category} Sub-Categories`;


    renderSubCategoryManager(
        category
    );


    new bootstrap.Modal(
        document.querySelector(
            '#subCategoryManagerModal'
        )
    ).show();

};


function renderSubCategoryManager(
    category
) {

    const container =
        document.querySelector(
            '#subCategoryManagerList'
        );


    const values =
        subCategories[
            category
        ] || [];


    if (
        values.length === 0
    ) {

        container.innerHTML = `

            <div
                class="text-muted
                       text-center
                       py-4">

                No sub-categories found.

            </div>

        `;

        return;

    }


    container.innerHTML =
        values
            .map(
                subCategory => `

                    <div
                        class="list-group-item
                               d-flex
                               justify-content-between
                               align-items-center">

                        <span>
                            ${esc(subCategory)}
                        </span>


                        <div>

                            <button
                                class="btn btn-sm btn-outline-primary me-1"
                                onclick="editSubCategory('${esc(category)}','${esc(subCategory)}')">

                                Edit

                            </button>


                            <button
                                class="btn btn-sm btn-outline-danger"
                                onclick="deleteSubCategory('${esc(category)}','${esc(subCategory)}')">

                                Delete

                            </button>

                        </div>

                    </div>

                `
            )
            .join('');

}


window.addSubCategoryFromManager =
function () {

    const category =
        document.querySelector(
            '#category'
        ).value;


    if (
        !category
    ) {

        alert(
            'Please select an Expense Category first.'
        );

        return;

    }


    const name =
        prompt(
            `Add Sub-Category under "${category}":`
        );


    if (
        !name ||
        !name.trim()
    ) {

        return;

    }


    const value =
        name.trim();


    if (
        !subCategories[
            category
        ]
    ) {

        subCategories[
            category
        ] = [];

    }


    if (
        subCategories[
            category
        ].some(
            item =>
                item.toLowerCase() ===
                value.toLowerCase()
        )
    ) {

        alert(
            'This Sub-Category already exists under this Category.'
        );

        return;

    }


    subCategories[
        category
    ].push(
        value
    );


    save();


    populateSubCategories(
        category
    );


    document.querySelector(
        '#subCategory'
    ).value =
        value;


    renderSubCategoryManager(
        category
    );

};


window.editSubCategory =
function (
    category,
    oldName
) {

    const newName =
        prompt(
            'Enter new Sub-Category name:',
            oldName
        );


    if (
        !newName ||
        !newName.trim() ||
        newName.trim() === oldName
    ) {

        return;

    }


    const value =
        newName.trim();


    const list =
        subCategories[
            category
        ] || [];


    if (
        list.some(
            item =>
                item.toLowerCase() ===
                value.toLowerCase()
        )
    ) {

        alert(
            'This Sub-Category already exists.'
        );

        return;

    }


    const index =
        list.indexOf(
            oldName
        );


    if (
        index === -1
    ) {

        return;

    }


    list[index] =
        value;


    /*
       Preserve existing transactions.
    */

    transactions =
        transactions.map(
            transaction =>

                transaction.category ===
                    category &&
                transaction.subCategory ===
                    oldName

                    ? {
                        ...transaction,
                        subCategory: value
                    }

                    : transaction
        );


    save();


    populateSubCategories(
        category
    );


    renderSubCategoryManager(
        category
    );


    render();

};


window.deleteSubCategory =
function (
    category,
    subCategory
) {

    const used =
        transactions.some(
            transaction =>
                transaction.category ===
                    category &&
                transaction.subCategory ===
                    subCategory
        );


    if (used) {

        alert(
            'This Sub-Category is used by an existing transaction. ' +
            'Please edit that transaction first.'
        );

        return;

    }


    if (
        !confirm(
            `Delete "${subCategory}" from "${category}"?`
        )
    ) {

        return;

    }


    subCategories[
        category
    ] =
        (
            subCategories[
                category
            ] || []
        ).filter(
            item =>
                item !== subCategory
        );


    save();


    populateSubCategories(
        category
    );


    renderSubCategoryManager(
        category
    );

};


/* ============================================================
   TRANSACTION TYPE
============================================================ */

function updateTransactionForm() {

    const type =
        document.querySelector(
            '#transactionType'
        ).value;


    const income =
        type === 'Income';


    /*
       Income Category
    */

    document.querySelector(
        '#incomeCategorySection'
    ).classList.toggle(
        'd-none',
        !income
    );


    /*
       Expense Category
    */

    document.querySelector(
        '#expenseCategorySection'
    ).classList.toggle(
        'd-none',
        income
    );


    /*
       Expense Sub Category
    */

    document.querySelector(
        '#expenseSubCategorySection'
    ).classList.toggle(
        'd-none',
        income
    );


    /*
       Form title
    */

    const editId =
        document.querySelector(
            '#editId'
        ).value;


    if (!editId) {

        document.querySelector(
            '#formTitle'
        ).textContent =
            'Add ' + type;

    }


    /*
       Populate correct category system
    */

    if (income) {

        populateIncomeCategories();

    } else {

        populateExpenseCategories();

        populateSubCategories();

    }

}


/* ============================================================
   TYPE CHANGE EVENT
============================================================ */

document
    .querySelector(
        '#transactionType'
    )
    ?.addEventListener(
        'change',
        updateTransactionForm
    );


/* ============================================================
   PREPARE FORM
============================================================ */

window.prepareForm =
function (type) {

    const form =
        document.querySelector(
            '#transactionForm'
        );


    form.reset();


    document.querySelector(
        '#editId'
    ).value =
        '';


    document.querySelector(
        '#transactionType'
    ).value =
        type;


    document.querySelector(
        '#date'
    ).value =
        today();


    document.querySelector(
        '#formTitle'
    ).textContent =
        'Add ' + type;


    populateAccountDropdown();

    populatePaymentMethods();

    populateSources();

    populateIncomeCategories();

    populateExpenseCategories();

    updateTransactionForm();


    /*
       Clear selections
    */

    document.querySelector(
        '#transactionAccount'
    ).value =
        '';


    document.querySelector(
        '#payment'
    ).value =
        '';


    document.querySelector(
        '#source'
    ).value =
        '';


    if (
        type === 'Expense'
    ) {

        document.querySelector(
            '#category'
        ).value =
            '';


        populateSubCategories();

    } else {

        document.querySelector(
            '#incomeCategory'
        ).value =
            '';

    }

};


/* ============================================================
   EDIT TRANSACTION
============================================================ */

window.editTransaction =
function (transactionId) {

    const transaction =
        transactions.find(
            item =>
                item.id === transactionId
        );


    if (!transaction) {

        return;

    }


    const form =
        document.querySelector(
            '#transactionForm'
        );


    form.reset();


    document.querySelector(
        '#editId'
    ).value =
        transaction.id;


    document.querySelector(
        '#transactionType'
    ).value =
        transaction.type;


    document.querySelector(
        '#date'
    ).value =
        transaction.date;


    document.querySelector(
        '#amount'
    ).value =
        transaction.amount;


    populateAccountDropdown();

    populatePaymentMethods();

    populateSources();

    populateIncomeCategories();

    populateExpenseCategories();


    updateTransactionForm();


    document.querySelector(
        '#transactionAccount'
    ).value =
        transaction.accountId || '';


    document.querySelector(
        '#payment'
    ).value =
        transaction.payment || '';


    document.querySelector(
        '#source'
    ).value =
        transaction.source || '';


    document.querySelector(
        '#merchant'
    ).value =
        transaction.merchant || '';


    document.querySelector(
        '#description'
    ).value =
        transaction.description || '';


    document.querySelector(
        '#notes'
    ).value =
        transaction.notes || '';


    if (
        transaction.type ===
        'Income'
    ) {

        document.querySelector(
            '#incomeCategory'
        ).value =
            transaction.incomeCategory ||
            transaction.category ||
            '';

    } else {

        document.querySelector(
            '#category'
        ).value =
            transaction.category ||
            '';


        populateSubCategories(
            transaction.category || '',
            transaction.subCategory || ''
        );

    }


    document.querySelector(
        '#formTitle'
    ).textContent =
        'Edit Transaction';


    new bootstrap.Modal(
        document.querySelector(
            '#transactionModal'
        )
    ).show();

};


/* ============================================================
   SAVE TRANSACTION HELPER
============================================================ */
function persistTransaction(transaction, editId = '') {
    if (editId) {
        transactions = transactions.map(item =>
            item.id === editId ? transaction : item
        );
    } else {
        transactions.push(transaction);
    }

    save();
    populateAccountDropdown();
    populateAccountFilter();
    populateCategoryFilter();
    populateIncomeCategories();
    populateExpenseCategories();
    populatePaymentMethods();
    populateSources();
    renderAccounts();
    render();

    const modal = bootstrap.Modal.getInstance(
        document.querySelector('#transactionModal')
    );
    modal?.hide();
}


/* ============================================================
   SAVE TRANSACTION
============================================================ */

document
    .querySelector(
        '#transactionForm'
    )
    ?.addEventListener(
        'submit',
        event => {

            event.preventDefault();


            const editId =
                document.querySelector(
                    '#editId'
                ).value;


            const type =
                document.querySelector(
                    '#transactionType'
                ).value;


            const date =
                document.querySelector(
                    '#date'
                ).value;


            const amount =
                Number(
                    document.querySelector(
                        '#amount'
                    ).value
                );


            const accountId =
                document.querySelector(
                    '#transactionAccount'
                ).value;


            const payment =
                document.querySelector(
                    '#payment'
                ).value;


            const source =
                document.querySelector(
                    '#source'
                ).value;


            const merchant =
                document.querySelector(
                    '#merchant'
                ).value.trim();


            const description =
                document.querySelector(
                    '#description'
                ).value.trim();


            const notes =
                document.querySelector(
                    '#notes'
                ).value.trim();


            /*
               Validate common fields
            */

            if (!date) {

                alert(
                    'Please select a date.'
                );

                return;

            }


            if (
                !amount ||
                amount <= 0
            ) {

                alert(
                    'Amount must be greater than zero.'
                );

                return;

            }


            if (!accountId) {

                alert(
                    'Please select Amount Type / Account.'
                );

                return;

            }


            if (!payment) {

                alert(
                    'Please select Payment Method.'
                );

                return;

            }


            if (!source) {

                alert(
                    'Please select Source.'
                );

                return;

            }


            let category = '';

            let incomeCategory = '';

            let subCategory = '';


            /*
               INCOME
            */

            if (
                type === 'Income'
            ) {

                incomeCategory =
                    document.querySelector(
                        '#incomeCategory'
                    ).value;


                if (!incomeCategory) {

                    alert(
                        'Please select an Income Category.'
                    );

                    return;

                }


                category =
                    incomeCategory;

            }


            /*
               EXPENSE
            */

            else {

                category =
                    document.querySelector(
                        '#category'
                    ).value;


                subCategory =
                    document.querySelector(
                        '#subCategory'
                    ).value;


                if (!category) {

                    alert(
                        'Please select an Expense Category.'
                    );

                    return;

                }


                /*
                   Optional sub-category.

                   It is not forced because existing
                   transactions may not have one.
                */

                if (
                    subCategory ===
                    '__new'
                ) {

                    alert(
                        'Please select a valid Sub-Category.'
                    );

                    return;

                }

            }


            const existing =
                editId
                    ? transactions.find(
                        item =>
                            item.id === editId
                    )
                    : null;


            /*
               Create transaction.

               IMPORTANT:
               We preserve the existing transaction
               structure where possible.
            */

            const transaction = {

                ...(existing || {}),

                id:
                    editId ||
                    id(),

                type,

                date,

                amount,

                foodMyself: null,

                foodOthers: null,

                category,

                incomeCategory:
                    type === 'Income'
                        ? incomeCategory
                        : '',

                subCategory:
                    type === 'Expense'
                        ? subCategory
                        : '',

                accountId,

                payment,

                source,

                merchant,

                description,

                notes,

                createdAt:
                    existing?.createdAt ||
                    Date.now()

            };


            // Food expenses must be split in a separate popup before saving.
            if (type === 'Expense' && category === 'Food') {
                pendingFoodTransaction = transaction;
                pendingFoodEditId = editId;

                document.querySelector('#foodSplitTotal').textContent = money(amount);
                document.querySelector('#foodMyself').value =
                    Number(existing?.foodMyself ?? amount).toFixed(2);
                document.querySelector('#foodOthers').value =
                    Number(existing?.foodOthers ?? 0).toFixed(2);
                document.querySelector('#foodSplitError').classList.add('d-none');

                foodSplitModalInstance = bootstrap.Modal.getOrCreateInstance(
                    document.querySelector('#foodSplitModal')
                );
                foodSplitModalInstance.show();
                return;
            }

            persistTransaction(transaction, editId);

        }
    );




/* ============================================================
   FOOD SPLIT POPUP SAVE
============================================================ */
document.querySelector('#saveFoodSplit')?.addEventListener('click', () => {
    if (!pendingFoodTransaction || foodSplitSaveInProgress) return;

    const myselfInput = document.querySelector('#foodMyself');
    const othersInput = document.querySelector('#foodOthers');
    const myselfText = myselfInput.value.trim();
    const othersText = othersInput.value.trim();
    const myself = Number(myselfText);
    const others = Number(othersText);
    const total = Number(pendingFoodTransaction.amount);
    const error = document.querySelector('#foodSplitError');
    const saveButton = document.querySelector('#saveFoodSplit');

    error.classList.add('d-none');
    error.textContent = '';

    const hasAtMostTwoDecimals = value =>
        /^\d+(?:\.\d{1,2})?$/.test(value);

    if (
        myselfText === '' ||
        othersText === '' ||
        !hasAtMostTwoDecimals(myselfText) ||
        !hasAtMostTwoDecimals(othersText) ||
        !Number.isFinite(myself) ||
        !Number.isFinite(others) ||
        myself < 0 ||
        others < 0
    ) {
        error.textContent = 'Enter valid amounts with up to 2 decimal places. Zero is allowed.';
        error.classList.remove('d-none');
        return;
    }

    // Compare integer paise, not floating-point rupees.
    const toPaise = value => Math.round((value + Number.EPSILON) * 100);
    if (toPaise(myself) + toPaise(others) !== toPaise(total)) {
        error.textContent = 'Myself + Others must equal the total Food expense.';
        error.classList.remove('d-none');
        return;
    }

    const transactionToSave = {
        ...pendingFoodTransaction,
        amount: Number((toPaise(total) / 100).toFixed(2)),
        foodMyself: Number((toPaise(myself) / 100).toFixed(2)),
        foodOthers: Number((toPaise(others) / 100).toFixed(2))
    };

    const editId = pendingFoodEditId;
    const modalElement = document.querySelector('#foodSplitModal');
    const modalInstance = foodSplitModalInstance ||
        bootstrap.Modal.getOrCreateInstance(modalElement);

    foodSplitSaveInProgress = true;
    saveButton.disabled = true;
    saveButton.textContent = 'Saving…';

    // Save only after the split popup closes to avoid Bootstrap nested-modal
    // backdrop/focus issues. The original transaction modal closes in persistTransaction.
    const finishSave = () => {
        modalElement.removeEventListener('hidden.bs.modal', finishSave);
        pendingFoodTransaction = null;
        pendingFoodEditId = '';

        try {
            persistTransaction(transactionToSave, editId);
        } finally {
            foodSplitSaveInProgress = false;
            saveButton.disabled = false;
            saveButton.textContent = 'Save';
        }
    };

    modalElement.addEventListener('hidden.bs.modal', finishSave, { once: true });
    modalInstance.hide();
});

/* ============================================================
   SUB CATEGORY CHANGE
============================================================ */

document
    .querySelector(
        '#subCategory'
    )
    ?.addEventListener(
        'change',
        event => {

            if (
                event.target.value !==
                '__new'
            ) {

                return;

            }


            const category =
                document.querySelector(
                    '#category'
                ).value;


            if (!category) {

                return;

            }


            const name =
                prompt(
                    `Add Sub-Category under "${category}":`
                );


            if (
                name &&
                name.trim()
            ) {

                const value =
                    name.trim();


                if (
                    !subCategories[
                        category
                    ]
                ) {

                    subCategories[
                        category
                    ] = [];

                }


                const exists =
                    subCategories[
                        category
                    ].some(
                        item =>
                            item.toLowerCase() ===
                            value.toLowerCase()
                    );


                if (exists) {

                    alert(
                        'This Sub-Category already exists.'
                    );

                } else {

                    subCategories[
                        category
                    ].push(
                        value
                    );


                    save();

                }


                populateSubCategories(
                    category
                );


                document.querySelector(
                    '#subCategory'
                ).value =
                    value;

            } else {

                populateSubCategories(
                    category
                );

            }

        }
    );


/* ============================================================
   PERIOD FILTER
============================================================ */

function startOfWeek(
    date
) {

    const value =
        new Date(
            date
        );


    const day =
        value.getDay();


    value.setDate(
        value.getDate() -
        (
            day === 0
                ? 6
                : day - 1
        )
    );


    value.setHours(
        0,
        0,
        0,
        0
    );


    return value;

}


function inPeriod(
    date,
    period
) {

    if (
        period === 'all'
    ) {

        return true;

    }


    const transactionDate =
        new Date(
            date +
            'T00:00:00'
        );


    const now =
        new Date();


    const todayDate =
        new Date(
            now.toDateString()
        );


    if (
        period === 'today'
    ) {

        return (
            transactionDate.getTime() ===
            todayDate.getTime()
        );

    }


    if (
        period === 'week'
    ) {

        const start =
            startOfWeek(
                now
            );


        const end =
            new Date(
                start
            );


        end.setDate(
            end.getDate() + 7
        );


        return (
            transactionDate >= start &&
            transactionDate < end
        );

    }


    if (
        period === 'month'
    ) {

        return (
            transactionDate.getMonth() ===
                now.getMonth() &&

            transactionDate.getFullYear() ===
                now.getFullYear()
        );

    }


    if (
        period === 'lastMonth'
    ) {

        const month =
            now.getMonth() - 1;


        const year =
            now.getFullYear() +
            (
                month < 0
                    ? -1
                    : 0
            );


        const normalizedMonth =
            (
                month + 12
            ) % 12;


        return (
            transactionDate.getMonth() ===
                normalizedMonth &&

            transactionDate.getFullYear() ===
                year
        );

    }


    if (
        period === 'year'
    ) {

        return (
            transactionDate.getFullYear() ===
            now.getFullYear()
        );

    }


    return true;

}


/* ============================================================
   FILTERED TRANSACTIONS
============================================================ */

function filtered() {

    const period =
        document.querySelector(
            '#periodFilter'
        )?.value ||
        'all';


    const category =
        document.querySelector(
            '#categoryFilter'
        )?.value ||
        'all';


    const account =
        document.querySelector(
            '#accountFilter'
        )?.value ||
        'all';


    const type =
        document.querySelector(
            '#typeFilter'
        )?.value ||
        'all';


    const search =
        document.querySelector(
            '#searchFilter'
        )?.value
            .trim()
            .toLowerCase() ||
        '';


    return transactions

        .filter(
            transaction =>

                inPeriod(
                    transaction.date,
                    period
                )

                &&

                (
                    category ===
                    'all' ||

                    transaction.category ===
                    category ||

                    transaction.incomeCategory ===
                    category
                )

                &&

                (
                    account ===
                    'all' ||

                    transaction.accountId ===
                    account
                )

                &&

                (
                    type ===
                    'all' ||

                    transaction.type ===
                    type
                )

                &&

                (
                    !search ||

                    [

                        transaction.merchant,

                        transaction.description,

                        transaction.category,

                        transaction.incomeCategory,

                        transaction.subCategory,

                        transaction.payment,

                        transaction.source,

                        transaction.notes,

                        transaction.amount,

                        transaction.date,

                        getAccountName(
                            transaction.accountId
                        )

                    ].some(
                        value =>
                            String(
                                value ?? ''
                            )
                                .toLowerCase()
                                .includes(
                                    search
                                )
                    )

                )

        )

        .sort(
            (a, b) =>
                b.date.localeCompare(a.date) ||
                (b.createdAt - a.createdAt)
        )
        .map(transaction => {
            if (!foodSplitFilterActive || transaction.type !== 'Expense' || transaction.category !== 'Food') {
                return transaction;
            }

            // Older Food records without split values are treated as Myself.
            const myself = Number(transaction.foodMyself ?? transaction.amount);
            const others = Number(transaction.foodOthers ?? 0);
            const amount =
                (foodSplitSelection.myself ? myself : 0) +
                (foodSplitSelection.others ? others : 0);

            return { ...transaction, amount };
        })
        .filter(transaction =>
            !foodSplitFilterActive ||
            transaction.type !== 'Expense' ||
            transaction.category !== 'Food' ||
            transaction.amount > 0
        );

}


/* ============================================================
   DASHBOARD RENDER
============================================================ */

function render() {

    const data =
        filtered();


    const income =
        data
            .filter(
                transaction =>
                    transaction.type ===
                    'Income'
            )
            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    Number(
                        transaction.amount
                    ),

                0
            );


    const expenses =
        data
            .filter(
                transaction =>
                    transaction.type ===
                    'Expense'
            )
            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    Number(
                        transaction.amount
                    ),

                0
            );


    const balance =
        income -
        expenses;


    const highest =
        data
            .filter(
                transaction =>
                    transaction.type ===
                    'Expense'
            )
            .reduce(
                (
                    max,
                    transaction
                ) =>
                    Math.max(
                        max,
                        Number(
                            transaction.amount
                        )
                    ),

                0
            );


    const expenseDays =
        new Set(
            data
                .filter(
                    transaction =>
                        transaction.type ===
                        'Expense'
                )
                .map(
                    transaction =>
                        transaction.date
                )
        ).size || 1;


    const cards = [

        [
            'Total Income',
            income,
            'success'
        ],

        [
            'Total Expenses',
            expenses,
            'danger'
        ],

        [
            'Balance',
            balance,
            balance >= 0
                ? 'success'
                : 'danger'
        ],

        [
            'Transactions',
            data.length,
            'primary'
        ],

        [
            'Avg Daily Expense',
            expenses /
            expenseDays,
            'info'
        ],

        [
            'Highest Expense',
            highest,
            'warning'
        ]

    ];


    document.querySelector(
        '#cards'
    ).innerHTML =

        cards
            .map(
                (
                    [
                        title,
                        value,
                        color
                    ]
                ) => `

                    <div
                        class="col-6 col-xl-2">

                        <div
                            class="card stat p-3
                                   border-start
                                   border-4
                                   border-${color}">

                            <small>
                                ${title}
                            </small>


                            <h4>

                                ${
                                    title ===
                                    'Transactions'

                                        ? value

                                        : money(
                                            value
                                        )
                                }

                            </h4>

                        </div>

                    </div>

                `
            )
            .join('');


    document.querySelector(
        '#transactionCount'
    ).textContent =
        `${data.length} transaction(s) shown`;


    renderTransactions(
        data
    );


    renderCharts(
        data
    );


    renderAccounts();

}


/* ============================================================
   TRANSACTION TABLE
============================================================ */

function renderTransactions(
    data
) {

    const tbody =
        document.querySelector(
            '#transactions tbody'
        );


    tbody.innerHTML =
        data
            .map(
                transaction => `

                    <tr>

                        <td>

                            ${new Date(
                                transaction.date +
                                'T00:00:00'
                            ).toLocaleDateString(
                                'en-IN'
                            )}

                        </td>


                        <td>

                            <span
                                class="badge ${
                                    transaction.type ===
                                    'Expense'

                                        ? 'text-bg-danger'

                                        : 'text-bg-success'
                                }">

                                ${esc(
                                    transaction.type
                                )}

                            </span>

                        </td>


                        <td>

                            ${esc(
                                transaction.description ||
                                transaction.merchant ||
                                '-'
                            )}

                        </td>


                        <td>

                            ${esc(
                                transaction.type ===
                                'Income'

                                    ? (
                                        transaction.incomeCategory ||
                                        transaction.category ||
                                        '-'
                                    )

                                    : (
                                        transaction.category ||
                                        '-'
                                    )
                            )}

                        </td>


                        <td>

                            ${esc(
                                transaction.subCategory ||
                                '-'
                            )}

                        </td>


                        <td>

                            ${esc(
                                getAccountName(
                                    transaction.accountId
                                )
                            )}

                        </td>


                        <td>

                            ${esc(
                                transaction.payment ||
                                '-'
                            )}

                        </td>


                        <td>

                            ${esc(
                                transaction.source ||
                                '-'
                            )}

                        </td>


                        <td
                            class="text-end
                                   fw-semibold
                                   ${
                                       transaction.type ===
                                       'Expense'

                                           ? 'text-danger'

                                           : 'text-success'
                                   }">

                            ${
                                transaction.type ===
                                'Expense'
                                    ? '-'
                                    : '+'
                            }

                            ${money(
                                transaction.amount
                            )}

                        </td>


                        <td
                            class="text-nowrap">

                            <button
                                class="btn btn-sm
                                       btn-outline-primary
                                       me-1"
                                onclick="editTransaction('${transaction.id}')">

                                Edit

                            </button>


                            <button
                                class="btn btn-sm
                                       btn-outline-danger"
                                onclick="deleteTransaction('${transaction.id}')">

                                Delete

                            </button>

                        </td>

                    </tr>

                `
            )
            .join('');


    document.querySelector(
        '#emptyState'
    ).classList.toggle(
        'd-none',
        data.length > 0
    );

}


/* ============================================================
   DELETE TRANSACTION
============================================================ */

window.deleteTransaction =
function (transactionId) {

    if (
        !confirm(
            'Delete this transaction?'
        )
    ) {

        return;

    }


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !==
                transactionId
        );


    save();


    populateAccountDropdown();

    render();

};


/* ============================================================
   CHARTS
============================================================ */

function renderCharts(
    data
) {

    const months = {};

    const categories = {};


    data
        .filter(
            transaction =>
                transaction.type ===
                'Expense'
        )
        .forEach(
            transaction => {

                const date =
                    new Date(
                        transaction.date +
                        'T00:00:00'
                    );


                const key =
                    `${date.getFullYear()}-${String(
                        date.getMonth() + 1
                    ).padStart(2, '0')}`;


                months[key] =
                    (
                        months[key] ||
                        0
                    ) +
                    Number(
                        transaction.amount
                    );


                const category =
                    transaction.category ||
                    'Other';


                categories[category] =
                    (
                        categories[category] ||
                        0
                    ) +
                    Number(
                        transaction.amount
                    );

            }
        );


    const sortedMonths =
        Object.keys(
            months
        ).sort();


    const labels =
        sortedMonths.map(
            key => {

                const [
                    year,
                    month
                ] =
                    key.split('-');


                return new Date(
                    Number(year),
                    Number(month) - 1,
                    1
                ).toLocaleString(
                    'en-IN',
                    {
                        month: 'short',
                        year: 'numeric'
                    }
                );

            }
        );


    monthlyChart?.destroy();

    categoryChart?.destroy();


    monthlyChart =
        new Chart(
            document.querySelector(
                '#monthlyChart'
            ),
            {

                type: 'bar',

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                'Expenses',

                            data:
                                sortedMonths.map(
                                    key =>
                                        months[key]
                                )

                        }

                    ]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            }
        );


    categoryChart =
        new Chart(
            document.querySelector(
                '#categoryChart'
            ),
            {

                type: 'doughnut',

                data: {

                    labels:
                        Object.keys(
                            categories
                        ),

                    datasets: [

                        {

                            data:
                                Object.values(
                                    categories
                                )

                        }

                    ]

                },

                options: {
                    responsive: true,
                    onClick: (event, elements, chart) => {
                        if (!elements.length) return;
                        const clickedCategory = chart.data.labels[elements[0].index];
                        if (clickedCategory === 'Food') {
                            foodSplitFilterActive = true;
                            foodSplitSelection = { myself: true, others: true };
                            document.querySelector('#foodMyselfFilter').checked = true;
                            document.querySelector('#foodOthersFilter').checked = true;
                        } else {
                            foodSplitFilterActive = false;
                        }
                        render();
                    },
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }

            }
        );

    const foodFilters = document.querySelector('#foodChartFilters');
    if (foodFilters) {
        foodFilters.classList.toggle('d-none', !foodSplitFilterActive);
    }
    if (foodSplitFilterActive) {
        document.querySelector('#foodMyselfFilter').checked = foodSplitSelection.myself;
        document.querySelector('#foodOthersFilter').checked = foodSplitSelection.others;
        const foodTotal = data
            .filter(t => t.type === 'Expense' && t.category === 'Food')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        document.querySelector('#foodFilterTotal').textContent =
            `Filtered Food total: ${money(foodTotal)}`;
    }

}


/* ============================================================
   EXCEL EXPORT
============================================================ */

function exportExcel(
    data = filtered(),
    name = 'Expense_Report'
) {

    if (
        !data.length
    ) {

        alert(
            'No transactions to export.'
        );

        return;

    }


    const rows =
        data.map(
            transaction => ({

                Date:
                    transaction.date,

                Type:
                    transaction.type,

                Amount:
                    Number(
                        transaction.amount
                    ),

                Category:
                    transaction.type ===
                    'Income'

                        ? transaction.incomeCategory

                        : transaction.category,

                'Sub-Category':
                    transaction.subCategory ||
                    '',

                'Amount Type / Account':
                    getAccountName(
                        transaction.accountId
                    ),

                'Payment Method':
                    transaction.payment ||
                    '',

                Source:
                    transaction.source ||
                    '',

                Merchant:
                    transaction.merchant ||
                    '',

                Description:
                    transaction.description ||
                    '',

                Notes:
                    transaction.notes ||
                    ''

            })
        );


    const worksheet =
        XLSX.utils.json_to_sheet(
            rows
        );


    worksheet['!cols'] = [

        { wch: 14 },
        { wch: 12 },
        { wch: 15 },
        { wch: 25 },
        { wch: 25 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
        { wch: 25 },
        { wch: 35 },
        { wch: 40 }

    ];


    const totalIncome =
        data
            .filter(
                transaction =>
                    transaction.type ===
                    'Income'
            )
            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    Number(
                        transaction.amount
                    ),

                0
            );


    const totalExpenses =
        data
            .filter(
                transaction =>
                    transaction.type ===
                    'Expense'
            )
            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total +
                    Number(
                        transaction.amount
                    ),

                0
            );


    const summary = [

        [
            'Expense Report Summary',
            ''
        ],

        [
            'Generated',
            new Date()
                .toLocaleString(
                    'en-IN'
                )
        ],

        [
            'Total Income',
            totalIncome
        ],

        [
            'Total Expenses',
            totalExpenses
        ],

        [
            'Balance',
            totalIncome -
            totalExpenses
        ],

        [
            'Transaction Count',
            data.length
        ]

    ];


    const summarySheet =
        XLSX.utils.aoa_to_sheet(
            summary
        );


    const accountRows =
        accounts.map(
            account => {

                const accountTransactions =
                    data.filter(
                        transaction =>
                            transaction.accountId ===
                            account.id
                    );


                const income =
                    accountTransactions
                        .filter(
                            transaction =>
                                transaction.type ===
                                'Income'
                        )
                        .reduce(
                            (
                                total,
                                transaction
                            ) =>
                                total +
                                Number(
                                    transaction.amount
                                ),

                            0
                        );


                const expense =
                    accountTransactions
                        .filter(
                            transaction =>
                                transaction.type ===
                                'Expense'
                        )
                        .reduce(
                            (
                                total,
                                transaction
                            ) =>
                                total +
                                Number(
                                    transaction.amount
                                ),

                            0
                        );


                return {

                    Account:
                        account.name,

                    Type:
                        account.type,

                    'Opening Balance':
                        Number(
                            account.openingBalance ||
                            0
                        ),

                    Income:
                        income,

                    Expenses:
                        expense,

                    'Current Balance':
                        Number(
                            account.openingBalance ||
                            0
                        ) +
                        income -
                        expense

                };

            }
        );


    const accountSheet =
        XLSX.utils.json_to_sheet(
            accountRows
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Transactions'
    );


    XLSX.utils.book_append_sheet(
        workbook,
        summarySheet,
        'Summary'
    );


    XLSX.utils.book_append_sheet(
        workbook,
        accountSheet,
        'Account Summary'
    );


    XLSX.writeFile(
        workbook,
        `${name}_${today()}.xlsx`
    );

}


/* ============================================================
   EXPORT BUTTONS
============================================================ */

document
    .querySelector(
        '#exportExcel'
    )
    ?.addEventListener(
        'click',
        () =>
            exportExcel(
                transactions,
                'Expense_Report_All'
            )
    );


document
    .querySelector(
        '#exportFiltered'
    )
    ?.addEventListener(
        'click',
        () =>
            exportExcel(
                filtered(),
                'Expense_Report_Filtered'
            )
    );


/* ============================================================
   FILTER EVENTS
============================================================ */

[
    'periodFilter',
    'categoryFilter',
    'accountFilter',
    'typeFilter'
]
.forEach(
    elementId => {

        document
            .querySelector(
                '#' + elementId
            )
            ?.addEventListener(
                'change',
                render
            );

    }
);


document
    .querySelector(
        '#searchFilter'
    )
    ?.addEventListener(
        'input',
        render
    );


document.querySelector('#foodMyselfFilter')?.addEventListener('change', event => {
    foodSplitSelection.myself = event.target.checked;
    foodSplitFilterActive = true;
    render();
});

document.querySelector('#foodOthersFilter')?.addEventListener('change', event => {
    foodSplitSelection.others = event.target.checked;
    foodSplitFilterActive = true;
    render();
});

// Show the Myself/Others filters when Food is selected in the category filter.
document.querySelector('#categoryFilter')?.addEventListener('change', event => {
    foodSplitFilterActive = event.target.value === 'Food';
    render();
});


/* ============================================================
   CLEAR DATA
============================================================ */

document
    .querySelector(
        '#clearData'
    )
    ?.addEventListener(
        'click',
        () => {

            if (
                !confirm(
                    'This will permanently clear all transactions.\n\n' +
                    'Accounts, categories and settings will remain.\n\n' +
                    'Continue?'
                )
            ) {

                return;

            }


            transactions = [];


            save();


            render();

            renderAccounts();

            populateAccountDropdown();

        }
    );


/* ============================================================
   INITIALIZE APPLICATION
============================================================ */

function initializeApplication() {

    /*
       Preserve existing transactions.
    */

    if (
        !Array.isArray(
            transactions
        )
    ) {

        transactions = [];

    }


    /*
       Existing expense categories
       are preserved.
    */

    if (
        !Array.isArray(
            expenseCategories
        )
    ) {

        expenseCategories =
            [
                ...defaultExpenseCategories
            ];

    }


    /*
       Initialize income categories.
    */

    if (
        !Array.isArray(
            incomeCategories
        )
    ) {

        incomeCategories =
            [
                ...defaultIncomeCategories
            ];

    }


    /*
       Initialize subcategories.
    */

    initializeSubCategories();


    /*
       Initialize accounts.
    */

    initializeAccounts();


    /*
       Initialize payment methods.
    */

    if (
        !Array.isArray(
            paymentMethods
        )
    ) {

        paymentMethods =
            [
                ...defaultPaymentMethods
            ];

    }


    /*
       Initialize sources.
    */

    if (
        !Array.isArray(
            sources
        )
    ) {

        sources =
            [
                ...defaultSources
            ];

    }


    save();


    /*
       Populate all dropdowns.
    */

    populateIncomeCategories();

    populateExpenseCategories();

    populateSubCategories();

    populateAccountDropdown();

    populateAccountFilter();

    populatePaymentMethods();

    populateSources();

    populateCategoryFilter();


    /*
       Default form
    */

    prepareForm(
        'Expense'
    );


    /*
       Dashboard
    */

    render();

}


/* ============================================================
   START
============================================================ */

initializeApplication();
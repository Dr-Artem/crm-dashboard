import { customers } from './customers.js';
import customerItemTemplate from './templates/customerItemTemplate.hbs';
import paginationItemTemplate from './templates/paginationItemTemplate.hbs';

export default class Main {
    constructor() {
        this.filteredCustomers = customers;
        this.pagintaion = {
            itemsPerPage: 8,
            currentPage: 1,
        };
        this.tableBody = document.querySelector('.table__body');
        this.pagination = document.querySelector('.pagination');
        this.countOfResults = document.querySelector('.customers__footer-count');
        this.searchForm = document.querySelector('.form');

        this.searchForm.addEventListener('submit', event => {
            event.preventDefault();
            this.handleSearch();
        });

        this.updateTable();
    }

    paginate(array, page_size, page_number) {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    renderTable(customers) {
        this.tableBody.innerHTML = '';
        this.tableBody.insertAdjacentHTML('beforeend', customerItemTemplate(customers));
    }

    renderPagination(totalItems, itemsPerPage, currentPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const pages = [];
        const paginationRange = 2;

        const hasPrev = currentPage > 1;
        const hasNext = currentPage < totalPages;
        const prevPage = currentPage - 1;
        const nextPage = currentPage + 1;

        if (currentPage > paginationRange + 1) {
            pages.push({ number: 1 });
            pages.push({ ellipsis: true });
        }

        for (let i = Math.max(1, currentPage - paginationRange); i <= Math.min(totalPages, currentPage + paginationRange); i++) {
            pages.push({ number: i, active: i === currentPage });
        }

        if (currentPage < totalPages - paginationRange) {
            pages.push({ ellipsis: true });
            pages.push({ number: totalPages });
        }

        const context = {
            pages,
            hasPrev,
            prevPage,
            hasNext,
            nextPage,
        };

        this.pagination.innerHTML = '';
        this.pagination.insertAdjacentHTML('beforeend', paginationItemTemplate(context));

        document.querySelectorAll('.pagination__btn').forEach(button => {
            if (!button.classList.contains('ellipsis')) {
                button.addEventListener('click', event => this.paginationHandler(event));
            }
        });

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage >= totalItems ? start + 1 : start + itemsPerPage;
        this.countOfResults.innerHTML = `Showing data ${start + 1} to ${end} of ${totalItems} entries`;
    }

    paginationHandler(event) {
        if (!event.currentTarget.classList.contains('active')) {
            this.pagintaion.currentPage = parseInt(event.currentTarget.getAttribute('data-page'));
            this.updateTable();
        }
    }

    handleSearch() {
        const query = this.searchForm.querySelector('.form__input-text').value.toLowerCase();
        this.filteredCustomers = customers.filter(
            customer =>
                customer.customerName.toLowerCase().includes(query) ||
                customer.company.toLowerCase().includes(query) ||
                customer.phoneNumber.toLowerCase().includes(query) ||
                customer.email.toLowerCase().includes(query) ||
                customer.country.toLowerCase().includes(query)
        );
        this.pagintaion.currentPage = 1;
        this.updateTable();
    }

    updateTable() {
        const paginatedData = this.paginate(this.filteredCustomers, this.pagintaion.itemsPerPage, this.pagintaion.currentPage);
        this.renderTable(paginatedData);
        this.renderPagination(this.filteredCustomers.length, this.pagintaion.itemsPerPage, this.pagintaion.currentPage);
    }
}

new Main();

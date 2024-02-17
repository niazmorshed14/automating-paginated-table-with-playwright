import {test, expect} from "@playwright/test";

test ("Handling WebTable/Pagination Table", async ({page})=> {
    await page.goto("https://testautomationpractice.blogspot.com/");
    await page.waitForTimeout(3000);

    //first we need to capture the table. 
    const table = await page.locator("#productTable"); //used the id of the table

    // 1. now finding total number of rows and columns
    const columns = await table.locator('thead tr th'); 
    console.log("The total number of columns are: ", await columns.count()); //printing the total number of columns
    expect (await columns.count()).toBe(4); //assertion

    const rows = await table.locator('tbody tr');
    console.log("The total number of rows are: ", await rows.count()); //priting the total number of columns
    expect (await rows.count()).toBe(5); //assertion

    /* th represents columns while tr represnts rows*/

    //2. selecting particular product checkbox from the table

    /* first we need to capture the rows and then filter them. For example in which row the desired product
    is available */

     const matchedRow = rows.filter({
        has: page.locator('td'), //every products in the rows have td tag
        hasText: 'Product 4' //matching the product name
    }); 
    await matchedRow.locator('input').check(); //clicking on the checkbox of product 4
    await page.waitForTimeout(3000);
    
   
    // 3. select multiple products from the table by using re-usable function
    await selectProducts(rows, page, "Product 1");
    await selectProducts(rows, page, "Product 2");
    await selectProducts(rows, page, "Product 3");
    await page.waitForTimeout(3000);
    

    //4. reading all the product details on the same page of the table using lopp
     for (let i=0; i< await rows.count(); i++) //for incrementing the rows
    {
        const row = rows.nth(i); //extracting the current row from all rows. nth starts from 0
        const allTds = row.locator('td'); //td contains all the data
        
        for (let j = 0; j < await allTds.count()-1; j++) //for incrementing the columns and we dont need the last column
        {
            console.log (await allTds.nth(j).textContent());
        };
    };
    
    
    // 5. reading all the product details present on all the pages of the table. handling table with pagination.
    //first finding out total number of pages in the table  
    const totalPages = await page.locator('.pagination li a');
    console.log('The total number of pages are: ', await totalPages.count());

    for (let p = 0; p< await totalPages.count(); p++) //repetion of pages
    {
        if (p>0) //clicking on the pages from the pagination except the first page
        {
            await totalPages.nth(p).click();
        };
        for (let i=0; i< await rows.count(); i++) //for incrementing the rows
    {
        const row = rows.nth(i); //extracting the current row from all rows. nth starts from 0
        const allTds = row.locator('td'); //td contains all the data
        
        for (let j = 0; j < await allTds.count()-1; j++) //for incrementing the columns and we dont need the last column
        {
            console.log (await allTds.nth(j).textContent());
        };
       
    };
    await page.waitForTimeout(3000);

    };

});


async function selectProducts(rows, page, name)
    {
        const matchedRow = rows.filter({
            has: page.locator('td'), 
            hasText: name
        }); 
        await matchedRow.locator('input').check(); 
    };

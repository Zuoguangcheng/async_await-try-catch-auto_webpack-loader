async function fun() {
    let test1 = await pro();

    let test2 = null;
    try {
        test2 = await pro();
    } catch (e) {
        console.log('====')
    }


    let test3 = '';
    test3 = await pro();


    try {
        await pro();
    } catch (e) {
        console.log('------')
    }

}

const pro = () => {
    return new Promise((resolve, reject) => {
        resolve(1)
    })
}

fun();

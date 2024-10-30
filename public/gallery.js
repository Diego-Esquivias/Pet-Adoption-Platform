    const loadingDOM = document.querySelector('.loading-text')
    const petsDOM = document.querySelector('.pets')


    const showPets = async () => {
    loadingDOM.style.visibility = 'visible'
    try {
        const {
        data: { pets },
        } = await axios.get('/gallery')
        if (tasks.length < 1) {
        petsDOM.innerHTML = '<h5 class="empty-list">No pets in your list</h5>'
        loadingDOM.style.visibility = 'hidden'
        return
        }
        const allPets = pets
        .map((pet) => {
            const { completed, _id: petID, name } = pet
            return `<div class="single-task ${completed && 'task-completed'}">
    <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
    <div class="task-links">
    
    <a href="profile.ejs?id=${petID}" class="adopt-link"><button> View </button></a>`
        })
        .join('')
        petsDOM.innerHTML = allPets
    } catch (error) {
        petsDOM.innerHTML =
        '<h5 class="empty-list">There was an error, please try later....</h5>'
    }
    loadingDOM.style.visibility = 'hidden'
    }

    showPets()
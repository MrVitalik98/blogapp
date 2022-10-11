
export const imageValidator = (file, size) => {
  const validMimeTypes = [ 'image/png', 'image/jpg', 'image/jpeg' ]
  const maxSize = 1024 * 1024 * size  

  if(file) {
    if(!validMimeTypes.includes(file?.type)) {
      return { status: 'error', message: 'image type is wrong' }
    }
  
    if(file?.size > maxSize) {
      return { status: 'error', message: `max size is ${size} MB` }
    }
  }

  return { file }
}


export const postValidator = (form, minTitleLength, minDescLength, imageRequired = true) => {
  const { title, description, image } = form

  if(!image && imageRequired) {
    return { status: 'error', message: 'please select an image' }
  }

  if(!title) {
    return { status: 'error', message: `enter post title` }
  }

  if(title.length < minTitleLength) {
    return { status: 'error', message: `post title must be at least ${minTitleLength} letters` }
  }

  if(!description) {
    return { status: 'error', message: `enter a description for the post` }
  }

  if(description.length < minDescLength) {
    return { status: 'error', message: `post description must be at least ${minDescLength} letters long` }
  }

  return { }
}


export const categoryValidator = (form, minNameLength, minDescLength) => {
  const { name, description, image } = form

  if(!image) {
    return { status: 'error', message: 'please select an image' }
  }

  if(!name) {
    return { status: 'error', message: `enter category name` }
  }

  if(name.length < minNameLength) {
    return { status: 'error', message: `category name must be at least ${minNameLength} letters` }
  }

  if(!description) {
    return { status: 'error', message: `enter a description for the category` }
  }

  if(description.length < minDescLength) {
    return { status: 'error', message: `category description must be at least ${minDescLength} letters long` }
  }

  return { }
}
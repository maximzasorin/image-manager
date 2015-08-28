# Image Manager API v1
## Version prefix
```
/api/v1/
```
## Queries
* [/albums](#user-content-albums)
* [/images](#user-content-images)
* [Errors](#user-content-errors)

### /albums
#### GET /albums
Return list of all albums.
```
{
    status: "success",
    data: [
        {
            "countImages": 41,
            "createdAt": "2015-08-07T10:05:30.973Z",
            "id": "NJnQfdp5",
            "maxHeight": 800,
            "maxWidth": 1200,
            "name": "Summer 2015",
            "saved": false
        },
        ...
    ]
}
```

#### POST /albums
Create a new album.

Request:
```
POST /api/v1/albums HTTP/1.1
Content-Type:multipart/form-data

Content-Disposition: form-data; name="name"
Random Album Name

Content-Disposition: form-data; name="maxWidth"
2500

Content-Disposition: form-data; name="maxHeight"
2500

Content-Disposition: form-data; name="archive"; filename="xxxx.zip"
Content-Type: application/zip
```

Response:
```
{
    status: "success",
    data: {
        "countImages": 41,
        "createdAt": "2015-08-07T10:05:30.973Z",
        "id": "NJnQfdp5",
        "maxHeight": 2500,
        "maxWidth": 2500,
        "name": "Random Album",
        "saved": false
    }   
}
```

#### GET /albums/:id
Return extended info about album and list of images.
```
{
    status: "success",
    data: {
        "createdAt": "2015-08-07T10:05:30.973Z", 
        "id": "NJnQfdp5", 
        "maxHeight": 800, 
        "maxWidth": 1200, 
        "name": "Unnamed album", 
        "saved": false,
        "images": [
    	    {
    	        "compliesRes": true, 
    	        "createdAt": "2015-08-07T10:05:30.992Z",
    	        "height": 333, 
    	        "id": "V1YhXf_a9", 
    	        "isUnique": true, 
    	        "path": "images/NXU0V3k2Bupj8eIU98YJps0oo7X3xHQh.jpg", 
    	        "width": 500
    	    }, 
    	    {
    	        "compliesRes": true, 
    	        "createdAt": "2015-08-07T10:05:30.992Z",
    	        "height": 425, 
    	        "id": "4yRhQGuac", 
    	        "isUnique": true, 
    	        "path": "images/dtU3vvCz4UsSpT74SrMqGzThWHBVSt8Y.jpg", 
    	        "width": 382
    	    }, 
    	    {
    	        "compliesRes": true, 
    	        "createdAt": "2015-08-07T10:05:30.992Z",
    	        "height": 313, 
    	        "id": "VkExhQfdT9", 
    	        "isUnique": true, 
    	        "path": "images/9NGhlAC6P6X7I4UHmV0AHZouKTUWBrGb.jpg", 
    	        "width": 500
    	    },
    	    ...
        ]
    }
}
```

#### PUT /albums/:id
Update album info.

Request:
```
{
    maxHeight: 2500,
    maxWidth: 2500,
    name: "Random Album",
    saved: false,
}
```

Response:
```
{
    status: "success",
    data: {
        countImages: 24,
        createdAt: "2015-08-24T07:18:20.624Z",
        id: "EJxFqhQh",
        maxHeight: 2500,
        maxWidth: 2500,
        name: "Random Album",
        saved: false
    }
}
```

#### DELETE /albums/:id
Remove album.

Response:
```
{
    status: "success",
    data: {
        id: "EJxFqhQh"
    }
}
```

#### GET /albums/:id/images
Return array of images.
```
{
    status: "success",
    data: [
        {
            "compliesRes": true, 
            "createdAt": "2015-08-07T10:05:30.992Z",
            "height": 333, 
            "id": "V1YhXf_a9", 
            "isUnique": true, 
            "path": "images/NXU0V3k2Bupj8eIU98YJps0oo7X3xHQh.jpg", 
            "width": 500
        }, 
        {
            "compliesRes": true, 
            "createdAt": "2015-08-07T10:05:30.992Z",
            "height": 425, 
            "id": "4yRhQGuac", 
            "isUnique": true, 
            "path": "images/dtU3vvCz4UsSpT74SrMqGzThWHBVSt8Y.jpg", 
            "width": 382
        }, 
        {
            "compliesRes": true, 
            "createdAt": "2015-08-07T10:05:30.992Z",
            "height": 313, 
            "id": "VkExhQfdT9", 
            "isUnique": true, 
            "path": "images/9NGhlAC6P6X7I4UHmV0AHZouKTUWBrGb.jpg", 
            "width": 500
        },
        ...
    ]
}
```

#### POST /albums/:id/images
Add a new image to album.

Request:
```
POST /api/v1/albums HTTP/1.1
Content-Type:multipart/form-data

Content-Disposition: form-data; name="image"; filename="xxxx.(png | jpg)"
Content-Type: application/zip
```

Response:
```
{
    status: "success",
    data: {
        "createdAt": "2015-08-24T07:18:20.643Z", 
        "height": 700, 
        "id": "EkgEqRhQ2", 
        "path": "images/b6hocDiFb7BHABunyBB5lz14P5LFCIfe.png", 
        "width": 600
    }
}
```

### /images
#### GET /images/:id
Return extended info about image.
```
{
    status: "success",
    data: {
    	"album": {
    		id: "NJnQfdp5",
    		name: "Unnamed album"
    	},
        "compliesRes": true, 
        "createdAt": "2015-08-07T10:05:30.992Z",
        "height": 313, 
        "id": "VkExhQfdT9", 
        "isUnique": true, 
        "path": "images/9NGhlAC6P6X7I4UHmV0AHZouKTUWBrGb.jpg", 
        "width": 500
    }
}
```

#### DELETE /images/:id
Remove image from album and everywhere.
```
{
    status: "success",
    data: {
        id: "VkExhQfdT9"
    }
}
```

## Errors
### Template
```
{
    status: "error",
    code: 000,
    message: "Random error."
}
```

### Examples
#### Not found error

Request:
```
GET /albums/EJxFqhQh
```

Response
```
{
    status: "error",
    code: 404,
    message: "Album not found."
}
```

#### Incorrect data for create album

Request:
```
POST /albums
```

Possible responses:
```
{
    status: "error",
    code: 400,
    message: "Album too big."
}
```
or
```
{
    status: "error",
    code: 400,
    message: "Not supported archive type."
}
```
or
```
{
    status: "error",
    code: 400,
    message: "Can not extract archive."
}
```
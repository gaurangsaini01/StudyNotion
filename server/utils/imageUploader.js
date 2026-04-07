const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = {
        folder
    };
    if(height) {
            options.height = height;
        }
        if(quality) {
            options.quality = quality;
        }
    options.resource_type = 'auto';

    //self coded 
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.tempFilePath, options, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    }); 
}

function getCloudinaryPublicIdCandidatesFromUrl(fileUrl) {
    if (!fileUrl || typeof fileUrl !== "string") {
        return [];
    }

    try {
        const decodedUrl = decodeURIComponent(fileUrl);
        const [, uploadPath] = decodedUrl.split("/upload/");

        if (!uploadPath) {
            return [];
        }

        const pathParts = uploadPath.split("/");
        const versionIndex = pathParts.findIndex((part) => /^v\d+$/.test(part));
        const publicPathParts = versionIndex >= 0
            ? pathParts.slice(versionIndex + 1)
            : pathParts.slice(1);

        if (!publicPathParts.length) {
            return [];
        }

        const publicIdWithExtension = publicPathParts.join("/");
        const publicIdWithoutExtension = publicIdWithExtension.replace(/\.[^/.]+$/, "");

        return [publicIdWithoutExtension, publicIdWithExtension].filter(Boolean);
    } catch (error) {
        return [];
    }
}

exports.deleteFileFromCloudinary = async ({
    publicId,
    fileUrl,
    resourceTypes = ["image", "video", "raw"],
}) => {
    const publicIdCandidates = publicId
        ? [publicId]
        : getCloudinaryPublicIdCandidatesFromUrl(fileUrl);

    if (!publicIdCandidates.length) {
        return [];
    }

    const results = [];

    for (const resourceType of resourceTypes) {
        for (const publicId of publicIdCandidates) {
            try {
                const result = await cloudinary.uploader.destroy(publicId, {
                    resource_type: resourceType,
                });
                results.push({ resourceType, publicId, result });

                if (result?.result === "ok") {
                    return results;
                }
            } catch (error) {
                results.push({ resourceType, publicId, error: error.message });
            }
        }
    }

    return results;
};

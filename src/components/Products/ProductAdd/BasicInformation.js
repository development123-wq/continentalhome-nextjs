"use client";

import React, { useState } from 'react'; // ⬅️ Add useState
import { Editor } from '@tinymce/tinymce-react';

function BasicInformation() {
    const [description, setDescription] = useState('');

    return (
        <>
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold ">Basic information</h6>
            </div>
            <div className="card-body">
                <div className="row g-3 align-items-center">
                    <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="proaddname" onChange={() => { }} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Product Title</label>
                        <input type="text" className="form-control" name="proaddtitle" onChange={() => { }} />
                    </div>

                    <div className="col-md-12">
                        <label className="form-label">Product Description</label>
                        <Editor
                            apiKey="ewqu5ti6bsjbxirh6rptpf3m05mwek075mt56suan91l8exv"
                            value={description}
                            onEditorChange={(content) => setDescription(content)}
                            init={{
                                height: 300,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default BasicInformation;

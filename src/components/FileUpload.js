import React from 'react'
import axios from 'axios'

/* Return percent of value / total */
const calculatePercent = (value, total) => Math.round(value / total * 100)

export default class FileUpload extends React.Component {
    state = {
        file: null,
        percent: 0,
        loading: false,
        submitted: false
    }

    handleChange = (e) => {
        console.log("FileUpload.handleChange e.target.files", e.target.files)

        this.setState({
            file: e.target.files[0],
            submitted: false
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        this.setState({loading: true, submitted: true})

        console.log("FileUpload.handleSubmit", this.state.file)

        const data = new FormData()

        data.append('files', this.state.file)

        const uploadRes = await axios({
            method: 'POST',
            url: 'http://localhost:1337/upload',
            data,
            onUploadProgress: (progress) => this.setState({percent: calculatePercent(progress.loaded, progress.total)})
        })
        this.setState({loading: false})

        console.log("FileUpload.handleSubmmit uploadRes", uploadRes)
    }

    render() {
        const {percent, loading, submitted} = this.state
        console.log("FileUpload.render percent", percent)

        return (
            <div className="FileUpload">
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} type="file" />
                    <button>Submit</button>
                </form>
                {submitted &&
                    <div className="Progress">
                        <div className="Progress__Seek" style={{width: `${percent}%`}}></div>
                    </div>
                }
                {loading && <p>Uploading...</p>}
            </div>
        )
    }
}

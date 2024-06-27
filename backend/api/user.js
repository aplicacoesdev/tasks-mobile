const bcrypt = require('bcryptjs')

module.exports = app => {
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.error('Erro ao gerar salt:', err)
                return callback(err)
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    console.error('Erro ao gerar hash:', err)
                    return callback(err)
                }
                callback(null, hash)
            })
        })
    }

    const save = (req, res) => {
        obterHash(req.body.password, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao gerar hash da senha' })
            }

            const password = hash

            app.db('users')
                .insert({
                    name: req.body.name,
                    email: req.body.email.toLowerCase(),
                    password
                })
                .then(_ => {
                    res.status(204).send()
                })
                .catch(err => {
                    res.status(400).json(err)
                })
        })
    }

    return { save }
}
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Container, Divider, Grid, TextField,
    FormGroup, InputLabel, Paper, Box, Icon, 
    Tabs, Tab, CircularProgress, Typography } from '@material-ui/core'
import AsyncSelect from 'react-select/async'

import Header from '../components/Header'
import CustomButton from '../components/Button.jsx'
import ArticleImages from '../components/ArticleImages.jsx'
import ArticlePreview from '../components/ArticlePreview'
import FloatingButton from '../components/FloatingButton.jsx'

import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { connect } from 'react-redux'

import { backendUrl, defineErrorMsg } from '../config/backend'
import { formatCustomURL } from '../config/masks'

import ReactQuill from 'react-quill'
import { modules } from '../config/QuillEditor'
import 'react-quill/dist/quill.snow.css'

import './css/Article.css'

class Article extends Component {

    state = {
        article: {
            _id: null,
            title: '',
            theme: null,
            category: null,
            shortDescription: '',
            longDescription: '',
            textArticle: '',
            smallImg: null,
            mediumImg: null,
            bigImg: null,
            customURL: '',
            createdAt: '',
        },
        categories: [],
        redirectTo: '',
        currentTab: 0,
        loading: false,
        saving: false,
    }

    getArticle = (customURL) => {
        const url = `${backendUrl}/articles/${customURL}`
        axios(url).then(async res => {
            await this.storageArticle(res.data)
            this.setState({
                loading: false
            })
        }).catch(async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 2000, closeOnClick: true})
            
            await this.setState({
                loading: false
            })

            setTimeout(this.goTo('articles'), 3000)
        })
    }

    handleChange = attr => event => {
        this.setState({article: {
            ...this.state.article,
            [attr]: event.target.value
        }})
    }

    handleChangeSelect = (value, attr) => {
        /* 
            Usado para definir os valores de theme e
            category (dos campos selects).
        */
        this.setState({article: {...this.state.article,[attr]: value || null}})
        
        /*
            Caso o attr desejado seja o tema, será feito uma busca de categorias
            com base no tema selecionado
        */
        if(attr === 'theme' && value){
            const url = `${backendUrl}/categories/${value._id}` 
            axios(url).then(res => this.setState({categories: res.data}))
        }

        /*
            Caso o campo tema esteja selecionado e seja removido o valor do campo
            a categoria selecionada também será removida
        */
        if(attr === 'theme' && !value){
            this.setState({article: {...this.state.article, category: null, theme: null},  categories: []})
        }
    }

    editorChange = value => {
        //Usado para persistir as alterações realizadas no Quill Component
        this.setState({article: {...this.state.article, textArticle: value}})
    }

    changeSavingState = () => {
        this.setState({saving: !this.state.saving})
    }

    save = (author) => async event => {
        //Função para salvar no banco 
        event.preventDefault()

        const article = await this.formatData(author)
        await this.changeSavingState()
        const url = `${backendUrl}/articles`
        await axios.post(url, article).then((res) => {
            toast.success((<div className="centerVertical"><Icon className="marginRight">done</Icon>Operação realizada com sucesso</div>), {autoClose: 2000, closeOnClick: true})
            this.changeSavingState()
            this.storageArticle(res.data)
        }).catch(async error => {
            const msg = await defineErrorMsg(error)
            toast.error((<div className="centerVertical"><Icon className="marginRight">clear</Icon>{msg}</div>), {autoClose: 2000, closeOnClick: true})
            this.changeSavingState()
        })
    }

    storageArticle = (article) => {
        /* Responsável por armazenar o artigo dentro do state */
        this.setState({
            article: {
                _id: article._id,
                title: article.title,
                /*
                    Os campos 'label' e 'value' são necessários para o componente 
                    Select mostrar as informações do registro
                    selecionado
                */
                theme: {
                    ...article.theme,
                    label: article.theme ? article.theme.name : '',
                    value: article.theme ? article.theme._id : '' 
                } || null,
                category: {
                    ...article.category,
                    label: article.category ? article.category.name : '',
                    value: article.category ? article.category._id : ''
                } || null,
                smallImg: article.smallImg || '',
                bigImg: article.bigImg || '',
                customURL: article.customURL || '',
                shortDescription: article.shortDescription || '',
                longDescription: article.longDescription || '',
                textArticle: article.textArticle || '',
                createdAt: article.createdAt,
            },
        })
    }

    formatData = (author) => {
        //Usado para formatar o registro para salvar no banco
        return {
            _id: this.state.article._id,
            title: this.state.article.title,
            theme: this.state.article.theme,
            category: this.state.article.category,
            shortDescription: this.state.article.shortDescription,
            customURL: this.state.article.customURL ? formatCustomURL(this.state.article.customURL) : formatCustomURL(this.state.article.title),
            longDescription: this.state.article.longDescription,
            textArticle: this.state.article.textArticle,
            author: {
                _id: author._id,
                name: author.name,
                email: author.email,
                gender: author.gender,
            }
        }
    }

    async loadThemes(query){
        //Carrega os temas disponíveis condicionado pela busca digitada
        const url = `${backendUrl}/themes?query=${query}`
        const response = await axios(url)
        let themes = response.data.themes.map((theme) => {
            return {
                ...theme,
                label: theme.name,
                value: theme._id,
            }
        }) || []
    
        return themes
    }

    async filterCategories(query, categories){
        /*
            Com as categorias carregadas, ao usuário digitar a opção desejada
            será realizado um filtro dentro de um array
        */
        
        if(categories.length === 0) return []

        let filteredCategories =  await categories.map((category) => {
            /*
                Os campos 'label' e 'value' são necessários para o componente 
                Select mostrar as informações do registro
                selecionado
            */
            const _category = {
                ...category,
                label: category.name,
                value: category._id
            }

            return category.name.toLowerCase().includes(query.toLowerCase()) ? _category : null
        }) 

        await filteredCategories.forEach( (elem, index) => {
            if(!elem) delete filteredCategories[index]
        })

        /*
            Caso não existe nenhum registro condicionado pela busca do usuário será retornado um elemento no array com valor nulo
            Assim a verificação deste elemento resultante se faz necessária para evitar efeitos colaterais
        */

        return filteredCategories
    }

    goTo = path => event => {
        //Responsável por redirecionar a página
        this.setState({redirectTo: path})
    }

    changeCurrentTab = (currentTab) => {
        this.setState({currentTab})
    }

    componentWillMount(){
        if(!this.props.match.params.id) return
        this.setState({loading: true})
    }

    componentDidMount(){
        if(!this.props.match.params.id) return
        const id = this.props.match.params.id
        this.getArticle(id)
    }


    render(){
        return(
            <Container>
                <ToastContainer />
                <FloatingButton action={() => document.documentElement.scrollTop = 0}/>
                { this.state.redirectTo && 
                    <Redirect to={`/${this.state.redirectTo}`} />
                }
                <Header title="Artigo" description="Crie um novo artigo" icon="note_add"/>
                { !this.state.loading && 
                    <Paper>
                        <Tabs value={this.state.currentTab} indicatorColor="primary" onChange={(evt, value) => this.changeCurrentTab(value)} variant="scrollable" scrollButtons="on">
                            <Tab label={(<span className="centerInline"><Icon>description</Icon>Informações principais</span>)} />
                            <Tab label={(<span className="centerInline"><Icon>visibility</Icon>Visualizar</span>)}/>
                            <Tab label={(<span className="centerInline"><Icon>images</Icon>Imagens</span>)}/>
                            <Tab label={(<span className="centerInline"><Icon>settings</Icon>Configurações</span>)} disabled/>
                        </Tabs>
                        { this.state.currentTab === 0 && 
                            <Box p={2}>
                                <Grid container>
                                    <Grid item xs={12} className="formGroupBetween">
                                        <TextField fullWidth helperText="Defina um titulo para o artigo, monte um título que seja simples e descritivo." id="title" label="Titulo" value={this.state.article.title || ''} margin="normal" onChange={this.handleChange('title')}/>
                                    </Grid>
                                    <Grid item xs={12} md={6} className="formGroup">
                                        <FormGroup>
                                            <InputLabel className="margin_bottom_x1">Tema *</InputLabel>
                                            <AsyncSelect cacheOptions value={this.state.article.theme || null} isClearable loadOptions={this.loadThemes} onChange={(value) => this.handleChangeSelect(value, 'theme')} noOptionsMessage={(event) => event.inputValue.length >= 3 ? 'Nenhum resultado encontrado' : 'Faça uma busca com pelo menos 3 caracteres'} loadingMessage={() => "Carregando..."} placeholder="Informe o tema do artigo" />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12} md={6} className="formGroup">
                                        <FormGroup>
                                            <InputLabel className="margin_bottom_x1">Categoria</InputLabel>
                                            <AsyncSelect cacheOptions value={this.state.article.category || null} isClearable loadOptions={(inputValue) => this.filterCategories(inputValue, this.state.categories)} onChange={(value) => this.handleChangeSelect(value, 'category')} noOptionsMessage={() => 'Nenhum resultado encontrado'} loadingMessage={() => "Carregando..."} placeholder="Informe a categoria do artigo" />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12} md={6} className="formGroup">
                                        <TextField fullWidth error={this.state.article.shortDescription.trim().length > 150} id="short_description" helperText={this.state.article.shortDescription.trim().length > 150 ? 'Máximo permitido são 150 caracteres' : 'Faça uma breve descrição sobre o artigo'} label="Breve descrição" value={this.state.article.shortDescription || ''} margin="normal" onChange={this.handleChange('shortDescription')}/>
                                    </Grid>
                                    <Grid item xs={12} md={6} className="formGroup">
                                        <TextField fullWidth id="custom_url" label="Link personalizado" helperText={`Link atual: ${this.state.article.customURL ? formatCustomURL(this.state.article.customURL) : formatCustomURL(this.state.article.title)}`} value={this.state.article.customURL} margin="normal" onChange={this.handleChange('customURL')} />
                                    </Grid>
                                    <Grid item xs={12} className="formGroup">
                                        <TextField fullWidth error={this.state.article.longDescription.trim().length > 300} id="long_description" helperText={this.state.article.longDescription.trim().length > 300 ? "Máximo permitido são 300 caracteres" : "Usado para descrever a futura imagem de titulo do artigo"} label="Longa descrição" value={this.state.article.longDescription || ''} margin="normal" onChange={this.handleChange('longDescription')}/>
                                    </Grid>
                                    <Grid item xs={12} className="formGroup">
                                        <TextField fullWidth id="author" label="Autor" disabled value={this.props.user.name || 'Autor não definido'} margin="normal"/>
                                    </Grid>
                                    <Grid item xs={12} className="divider">
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12} className="textArticle formGroup">
                                        <p className="p">Escreva o artigo abaixo</p>
                                        <ReactQuill 
                                            value={this.state.article.textArticle}
                                            onChange={this.editorChange}
                                            modules={modules}
                                        />                                    
                                    </Grid>
                                    <Grid item xs={12} className="footList formGroup">
                                        <Link to="/articles" className="linkRouter linkButton"><CustomButton color="gray" text="Voltar" icon="exit_to_app" /></Link>
                                        <CustomButton color="success" text={this.state.saving ? "Salvando..." : "Salvar"} icon="done" loading={this.state.saving} onClick={this.save(this.props.user)} />
                                    </Grid>
                                </Grid>
                            </Box>
                        }
                        {this.state.currentTab === 1 && 
                            <ArticlePreview article={this.state.article}/>
                        }
                        {this.state.currentTab === 2 && 
                            <ArticleImages article={this.state.article}/>
                        }
                        {this.state.currentTab === 3 && 
                            <Box>Tab3</Box>
                            // ... //
                        }
                    </Paper>
                }
                {this.state.loading && 
                    <Box display="flex" alignItems="center" flexDirection="column" m={5} p={5}>
                        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                            <CircularProgress />
                        </Box>
                        <Typography variant="body1" component="p">Carregando o artigo, por favor aguarde...</Typography>
                    </Box>
                }
            </Container>
        )
    }
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(Article)
import React, { useState , useCallback  , useEffect} from 'react';
import  {Container , Form , SubmitButton , List , DeleteButton  } from './styles';
import {FaGithub , FaPlus , FaSpinner, FaBars , FaTrash} from 'react-icons/fa';
import api from '../../services/api';
import {Link} from 'react-router-dom';

export default function Main() {
  const [newRepo , setNewRepo]  = useState('');
  const [repositorios , setRepositorios]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert ] = useState(null);

  //DisUpdate
  //Buscar
  useEffect(()=>{
    const repoStorage = localStorage.getItem('repos');
    if(repoStorage){
      setRepositorios(JSON.parse(repoStorage));
    }
  },[]);

  //salvar alteração
  useEffect(()=>{
    localStorage.setItem('repos' , JSON.stringify(repositorios));
  },[repositorios]);


function handleinputChange(event){
  setNewRepo(event.target.value);
  setAlert(null);
}

const handleDelete = useCallback((repo)=>{
    const find = repositorios.filter( r=> r.name !== repo);
    setRepositorios(find);
}, [repositorios]);


const handleSubmit= useCallback((event)=>{
    event.preventDefault();

  async function submit(){

    setLoading(true);
    setAlert(null);
    try{

        if(newRepo === ''){
          throw new Error ('Digite um nome valido para busca no repositorio!');
        }


        //'https://api.github.com/repos/facebook/react
      const response =  await api.get(`repos/${newRepo}`);

      const hasRepo = repositorios.find(repo => repo.name === newRepo);
        
      if(hasRepo){
        throw new Error('Repositorio ja esta na Lista!');
      }
      const data = {
        name: response.data.full_name,
      }
        setRepositorios([...repositorios, data]);
        setNewRepo('');
      }
      catch(error)
      {
          setAlert(true);
          console.log(error);
      }
      finally
      {
          setLoading(false);
      }

    }
    
   submit();
   
      
}, [newRepo, repositorios]);

/*async  function handleSubmit(event){
  event.preventDefault();

  const response =  await api.get(`repos/${newRepo}`);

    const data = {
       name: response.data.full_name,
    }
     setRepositorios([...repositorios, data]);
     setNewRepo('');
}
*/
 return (
    <Container>
        <h1>
          <FaGithub size={26}/>
          Meus Repositorios
        </h1>

        <Form onSubmit={handleSubmit} error={alert}>
          <input  
          type="text" 
          placeholder="Adicionar Repositorios" 
          value={newRepo}
          onChange={handleinputChange}
          />
        
          <SubmitButton loading={loading ? 1 : 0}>
                {loading ? (
                    <FaSpinner color="#FFF" size={14}/>
                 ):(
                  <FaPlus  color="#FFF" size={15} />
                 )}
          </SubmitButton>
        </Form>

        <List>
             {repositorios.map(repo => (
                  <li key={repo.name}>
                    <span>
                      <DeleteButton onClick={()=>handleDelete(repo.name)}>
                        <FaTrash size={14}/>
                      </DeleteButton>
                      {repo.name}</span>
                    <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                    <FaBars size={20}/>
                    </Link>
                  </li>
             ))}
        </List>
      
    </Container>
  )
}

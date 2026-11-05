import {useState, useRef, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowUpRight, ArrowLeft, ArrowRight, Check, Ticket, ShieldCheck, LockKeyhole, Download, CalendarDays, MapPin, RotateCcw} from 'lucide-react';

import RuixenPaymentCard, {type Payment} from '@/components/ui/modern-payment-form';
import {AnimatedTicket} from '@/components/ui/ticket-confirmation-card';
import {FeedbackWidget} from '@/components/ui/feedback-widget';
import './styles.css';
function App(){
 const [step,setStep]=useState(0);const [payment,setPayment]=useState<Payment|null>(null);const [feedback,setFeedback]=useState<{rating:string;feedback:string}|null>(null);const [downloaded,setDownloaded]=useState(false);
 const ticketRef=useRef<HTMLDivElement>(null);
 const ticketImage=useRef<Promise<{image:string;width:number;height:number}>|null>(null);
 const [downloadBusy,setDownloadBusy]=useState(false);
 const [downloadError,setDownloadError]=useState('');
 async function captureTicket(){
  const node=ticketRef.current;
  if(!node) throw new Error('Your ticket is not ready yet.');
  await document.fonts.ready;
  const {toPng}=await import('html-to-image');
  const {width,height}=node.getBoundingClientRect();
  const image=await toPng(node,{pixelRatio:3,backgroundColor:'#ffffff',cacheBust:false});
  return {image,width,height};
 }
 useEffect(()=>{
  if(step===1&&payment){
   const capture=captureTicket();
   ticketImage.current=capture;
   void capture.catch(()=>{if(ticketImage.current===capture)ticketImage.current=null;});
  }
 },[step,payment]);
 async function download(){
  if(!payment||downloadBusy)return;
  setDownloadBusy(true);setDownloadError('');
  try{
   const captured=ticketRef.current?await captureTicket():await ticketImage.current;
   if(!captured)throw new Error('Please return to your ticket and try again.');
   const {jsPDF}=await import('jspdf');
   const width=captured.width*0.264583;
   const height=captured.height*0.264583;
   const pdf=new jsPDF({unit:'mm',format:[width,height],orientation:width>height?'landscape':'portrait'});
   pdf.addImage(captured.image,'PNG',0,0,width,height);
   pdf.save(`${payment.id}.pdf`);
   setDownloaded(true);
  }catch(error){setDownloadError(error instanceof Error?error.message:'Unable to download your ticket. Please try again.');}
  finally{setDownloadBusy(false);}
 }
 function reset(){setStep(0);setPayment(null);setFeedback(null);setDownloaded(false);ticketImage.current=null;setDownloadError('')}
 return <div className="app"><main><nav className="steps" aria-label="Checkout progress">{['Payment','Your ticket','Feedback'].map((label,i)=><div className="step-wrap" key={label}><button disabled={i>step} aria-current={step===i?'step':undefined} className={`step ${step===i?'active':''} ${step>i?'complete':''}`} onClick={()=>setStep(i)}><span className="step-number">{step>i?<Check size={14}/>:String(i+1).padStart(2,'0')}</span>{label}</button>{i<2&&<span className={`step-line ${step>i?'done':''}`}/>}</div>)}</nav><div className="page-heading"><span className="eyebrow">{['GOOD EXPERIENCES START HERE','YOU’RE ON THE LIST','A LITTLE FEEDBACK GOES A LONG WAY'][step]}</span><h1>{['Make it official.','Your next experience, confirmed.','How did we do?'][step]}</h1><p>{['One simple payment. Something great to look forward to.','Your payment is complete. Your ticket is ready for you.','Tell us about your checkout. We’re all ears.'][step]}</p></div><div className={`checkout-layout ${step!==0?'later-step':''}`}><section className="main-panel" aria-label={['Payment details','Ticket confirmation','Review and feedback'][step]} key={step}>{step===0?<><div className="panel-heading"><div><h2>Payment details</h2><p>Choose how you’d like to pay.</p></div><span className="safe-badge"><LockKeyhole size={12}/> Secure checkout</span></div><RuixenPaymentCard onPay={p=>{setPayment(p);setStep(1)}}/></>:step===1&&payment?<div className="ticket-stage"><AnimatedTicket ref={ticketRef} ticketId={payment.id} amount={305.50} date={payment.date} cardHolder={payment.name} last4Digits={payment.last4} barcodeValue={payment.id} method={payment.method}/><button className="download-button" disabled={downloadBusy} onClick={download}><Download size={16}/>{downloadBusy?'Preparing ticket…':downloaded?'Download ticket again':'Download ticket (PDF)'}</button><button className="primary-button" onClick={()=>setStep(2)}>Continue to feedback <ArrowRight size={17}/></button><span className="secure-caption">Keep a copy for your records.</span></div>:<div className="feedback-stage">{feedback?<div className="thank-you"><span className="success-icon"><Check size={30}/></span><h2>Thanks for sharing!</h2><p>Your feedback has been recorded for this demo. You’re all set for your next experience.</p><blockquote>“{feedback.feedback}”</blockquote><span className="eyebrow">RATING: {({happy:'Amazing',neutral:'Okay',sad:'Bad','very-sad':'Terrible'} as Record<string,string>)[feedback.rating]}</span><button className="primary-button" disabled={downloadBusy} onClick={download}><Download size={16}/> Download your ticket</button><button className="text-button" onClick={reset}><RotateCcw size={14}/> Start a new demo</button></div>:<><span className="feedback-symbol" role="img" aria-label="Smiling face">😊</span><h2>A smooth experience?</h2><p>Select a rating, then leave a few words.<br/>Your thoughts help make the next checkout better.</p><FeedbackWidget label="Your experience" onSubmit={data=>setFeedback(data)}/><div className="feedback-order"><Ticket size={16}/><span>{payment?.id} · 305.50 DH paid</span></div><button className="text-button" onClick={()=>setStep(1)}><ArrowLeft size={14}/> Back to your ticket</button></>}</div>}{downloadError&&<p role="alert" className="error">{downloadError}</p>}</section><aside className="summary"><div className="event-art"><div className="art-grid"/><span className="event-tag">THE ANNUAL GATHERING</span><span className="art-title">Design<br/><i>Futures.</i></span><span className="art-year">20<br/>26</span><span className="art-bottom">NEW PERSPECTIVES. SHARED POSSIBILITIES. <ArrowUpRight size={17}/></span></div><div className="summary-body"><span className="eyebrow">YOUR NEXT EXPERIENCE</span><h2>Design Futures 2026</h2><p className="event-meta"><CalendarDays size={15}/>18 December 2026 · 09:00 UTC</p><p className="event-meta"><MapPin size={15}/>The Glasshouse, London</p><div className="order-line"><div><strong>General admission</strong><span>Full-day access · 1 ticket</span></div><span>289.00 DH</span></div><div className="fee-line"><span>Booking fee</span><span>16.50 DH</span></div><div className="total-line"><span>Total <small>MAD</small></span><strong>305.50 DH</strong></div><div className="included"><ShieldCheck size={17}/><p>A good experience, from the first click.<br/><span>Instant ticket. Easy download. All in one place.</span></p></div></div></aside></div><div className="trust-row"><span><LockKeyhole size={14}/> Private by design</span><i/><span><Ticket size={14}/> Instant ticket delivery</span><i/><span><ShieldCheck size={14}/> Simple, seamless checkout</span></div></main><footer><span>© 2026 Passage</span><span>Made for the moments ahead.</span><span>Demo experience · No real payments</span></footer></div>
}
createRoot(document.getElementById('root')!).render(<App/>);





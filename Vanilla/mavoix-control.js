function displayStatistics() {
	var i;
	$('#statistics').html('<table>');
	for(i=0;i<myvoice.log.length;i++) {
		var time=new Date(myvoice.log[i].time);
		$('#statistics').append(
			'<tr>'+
			'<td>'+myvoice.log[i].actionID+'</td>'+
			'<td>'+myvoice.log[i].actionName+'</td>'+
			'<td>'+myvoice.log[i].destID+'</td>'+
			'<td>'+myvoice.log[i].destName+'</td>'+
			'<td>'+time.toTimeString()+'</td>'+
			'</tr>');
	}
	$('#statistics').append('</table>');
}
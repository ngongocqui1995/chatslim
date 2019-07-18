
delete QA
where hoi=''
--------------

drop proc PhanHoi
---------------------------

create proc PhanHoi
@hoi nvarchar(max),
@traLoi nvarchar(max) output
as begin
	if @hoi !='' begin
	update QA
	set tlGiong =0
	declare @hoi1 nvarchar(100), @hoi2 nvarchar(100), @id int
	select @id = max(idCau)
	from QA
	set @id = @id +1
	if  CHARINDEX('->',@hoi) != 0 begin
		select @hoi1 = SUBSTRING(@hoi, 0, CHARINDEX('->',@hoi))
		select @hoi2 = SUBSTRING(@hoi, CHARINDEX('->',@hoi)+2, LEN(@hoi))
		declare @kqmax1 int
		exec traloiTrung @hoi1, @kqmax1 out
		declare @kqmax2 int
		exec traloiTrung @hoi2, @kqmax1 out
		if @kqmax1 >80 or @kqmax2 >80 begin
			set @traLoi = N'BẠN ĐÃ DÙNG NGÔN TỪ THIẾU PHÙ HỢP, MONG BẠN CÂN NHẮC HƠN!'
		end
		/*else if exists(select * from QA where hoi = @hoi1) begin
			Update QA
			set traLoi = @hoi2
			where hoi = @hoi1
			set @traLoi = N'Cảm ơn bạn đã dạy <3'
		end*/
		else begin
			insert into QA
			values(@id, @hoi1, @hoi2, 0, 0)
			set @traLoi = N'Cảm ơn bạn đã dạy <3'
		end
	end
	else begin
	---------------------------------------------------------------------------------------
		--set @traLoi = (select traLoi from QA where hoi = @hoi)
		declare @kqmax3 int
		exec traloiTrung @hoi, @kqmax3 out
		if @kqmax3 >80 begin
			set @traLoi = N'BẠN ĐÃ DÙNG NGÔN TỪ THIẾU PHÙ HỢP, MONG BẠN CÂN NHẮC HƠN!'
			delete QA
			where traLoi = '@temp'
		end
		else begin
		update QA
		set tlGiong =0
		declare @kqmax int, @idCau int
		exec DiemTrung @hoi, @kqmax out
			if @kqmax >= 65  and not exists(select * from QA where traLoi = N'@temp') begin
				Set	@idCau = (select top 1 idCau from QA where tlGiong = (select max(tlGiong) from QA) ORDER BY NEWID())
				set @traLoi = (select traLoi from QA where idCau=@idCau)
				if @traLoi ='@xoa' begin
					declare @noi nvarchar(100)
					set @noi = (select hoi from QA where trangThai=1)
					set @traLoi=N'CẢM ƠN BẠN RẤT NHIỀU, MÌNH ĐÃ BIẾT THẾ NÀO LÀ SAI, MÌNH SẼ HỌC HỎI ĐÚNG ĐẮN HƠN, VẬY KHI BẠ NÓI "'+@noi+N'" THÌ MÌNH SẼ NÓI...?'
					update QA
					set trangThai=2
					where trangThai=1	
					update QA
					set tlGiong=0	
				end
				else begin
					update QA
					set trangThai=0
					where trangThai=1
					update QA
					set trangThai=1
					where idCau = @idCau
					update QA
					set tlGiong = 0
					if @kqmax <=90 begin 
						insert into QA
						values(@id, @hoi, @traLoi, 0, 0)
					end
				end
			end
			else if @kqmax < 65 and not exists(select * from QA where traLoi = N'@temp' or trangThai=2)  begin
				set @traLoi = N'Mình chưa học cái này, mình phải trả lời làm sao? Nếu bạn nói: "'+ @hoi+ N'". Mình sẽ trả lời:...?'
				insert into QA
				values(@id, @hoi, N'@temp', 0, 0)
				update QA
				set tlGiong=0
			end
			else if exists(select* from QA where traLoi = N'@temp') begin
				update QA
				set traLoi = @hoi
				where traLoi = N'@temp'
				set @traLoi = N'Cảm ơn bạn nhiều <3'
			end
			else if exists(select* from QA where trangThai=2) begin
				declare @hoibot nvarchar(100)
				set @hoibot = (select hoi from QA where trangThai=2)
				insert into QA
				values(@id, @hoibot, @hoi, 0, 0)
				update QA
				set trangThai=3
				where trangThai=2
				set @traLoi=N'CẢM ƠN BẠN, MÌNH ĐÃ SỬA SAI'
			end
		end
	end
	end
	else begin
		set @traLoi=N'Nói gì đi chứ pa!'
	end
end
